var router = require('express').Router();
var weixin = require('../api/weixin');

var config = require('../config/config');
var autoConfig = config.wx_config.aotu;
var keywords = require('../config/keywords');

router.get('/', function(req, res, next) {
  console.log("checkSignature")
  if (weixin.checkSignature(req)) {
    return res.status(200).send(req.query.echostr);
  }
  return res.render('index', {
    createTime: new Date()
  });
});

router.post('/', function(req, res) {
  weixin.loop(req, res);
});

weixin.token = autoConfig.token;

weixin.textMsg(function(msg) {
  console.log(msg.content)
  var msgContent = trim(msg.content);

  if (!!keywords.exactKey[msgContent]) {
    weixin.sendMsg({
      fromUserName: msg.toUserName,
      toUserName: msg.fromUserName,
      msgType: 'text',
      content:  keywords.exactKey[msgContent].content,
      funcFlag: 0
    });
  } else {//转发给客服系统
    weixin.sendMsg({
      fromUserName: msg.toUserName,
      toUserName: msg.fromUserName,
      msgType: "transfer_customer_service",
      content: msg.content,
      funcFlag: 0
    });
  }

  function trim(str) {
    return ("" + str).replace(/^\s+/gi, '').replace(/\s+$/gi, '').toUpperCase();
  }

});



weixin.eventMsg(function(msg) {
  console.log(msg)
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'text',
    content: '',
    funcFlag: 0
  };
  var eventName = msg.event;
  if (eventName == 'subscribe') {
    if (autoConfig.subscribeMediaId && autoConfig.subscribeMediaId.length != 0) {
      resMsg.mediaId = autoConfig.subscribeMediaId;
      resMsg.msgType = "image";
      delete resMsg.content;
    } else {
      resMsg.content = autoConfig.subscribe;
    }
  } else if (eventName == 'unsubscribe') {//取消关注
  } else if (msg.event == 'CLICK') {//点击菜单栏
  } else if (eventName == 'LOCATION'){
    //resMsg.content = '上传地理位置纬度：'+msg.Latitude+',经度：'+ msg.Longitude;
  }

  console.log(resMsg)
  weixin.sendMsg(resMsg);
});

weixin.imageMsg(function(msg) {
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'image',
    mediaId: msg.mediaId,
    funcFlag: 0
  };
  weixin.sendPicMsg(resMsg);
});

weixin.locationMsg(function(msg) {
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'text',
    content: msg.label,
    funcFlag: 0
  };
  weixin.sendMsg(resMsg);
});

module.exports = router;
