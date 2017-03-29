var router = require('express').Router();
var weixin = require('../api/weixin');

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;
var keywords = require('../config/keywords');

router.get('/', function(req, res, next) {
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

weixin.token = aotuConfig.token;

weixin.textMsg(function(msg) {
  var msgContent = trim(msg.content);
  var flag = false;
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'text',
    content: 'TOM在不断的成长，欢迎您给出宝贵的意见，有任何疑问请回复 help 或 bz',
    funcFlag: 0
  };

  if (!!keywords.exactKey[msgContent]) {
    resMsg.content = keywords.exactKey[msgContent].content;
    flag = true;
  }

  function trim(str) {
    return ("" + str).replace(/^\s+/gi, '').replace(/\s+$/gi, '').toUpperCase();
  }

  if (flag) {
    weixin.sendMsg(resMsg);
  }

});



weixin.eventMsg(function(msg) {
  var flag = false;
  var resMsg = {
    fromUserName: msg.toUserName,
    toUserName: msg.fromUserName,
    msgType: 'text',
    content: '',
    funcFlag: 0
  };
  var eventName = msg.event;
  if (eventName == 'subscribe') {
    resMsg.content = 'TOM在此欢迎您！有任何疑问请回复 help 或 bz';
    flag = true;
  } else if (eventName == 'unsubscribe') {
    resMsg.content = 'TOM很伤心，为啥要取消呢?';
    flag = true;
  } else if (msg.event == 'CLICK') {
    //点击菜单栏
  } else if (eventName == 'LOCATION'){
    resMsg.content = '上传地理位置纬度：'+msg.Latitude+',经度：'+ msg.Longitude;
    flag = true;
  } else {
    flag = true;
  }
  if (flag) {
    weixin.sendMsg(resMsg);
  }
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
