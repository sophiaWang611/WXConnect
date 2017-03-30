var router = require('express').Router();
var request = require('request');

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;

var util = require('../util/util');

router.get('/', function(req, res, next) {
  res.status(200).send('api page');
});


router.get('/token', function(req, res, next) {
  util.getToken(aotuConfig, function(result) {
    if (result.err) {
      return res.status(500).send(result.msg);
    }
    return res.status(200).send(result.data);
  });
});

router.get('/menu_list', function(req, res, next) {
  util.getToken(aotuConfig, function(result) {
    if (result.err) {
      return res.status(500).send(result.msg);
    }
    var access_token = result.data.access_token;
    var url = 'https://api.weixin.qq.com/cgi-bin/menu/get?access_token=' + access_token;

    request.get({
      url: url
    }, function(error, response, body) {
      if (!error) {
        return res.status(200).send(JSON.parse(body));
      }
      return res.status(500).send('获取menu_list出错');
    });

  });
});

router.get('/menu_create', function(req, res, next) {
  var key = req.query.key;
  var form = !!key ? aotuConfig[key] : aotuConfig['menu'];
  var url = !!key ? 'https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token=' : 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=';

  util.getToken(aotuConfig, function(result) {
    if (result.err) {
      return res.status(500).send(result.msg);
    }
    var access_token = result.data.access_token;
    request.post({
      url: url + access_token,
      form: JSON.stringify(form)
    }, function(error, response, body) {
      if (!error) {
        return res.status(200).send(JSON.parse(body));
      }
      return res.status(500).send('创建菜单失败');
    });
  });
});

//发送群发消息
router.post('/send_all_text',function(req,res,next){
  var content = req.body.msgContent;
  var url = 'https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=';

  util.getToken(aotuConfig, function(result){
    if(result.err){
      return res.status(500).send(result.msg);
    }

    var form=   {
       "filter":{
          "is_to_all":true
       },
       "text":{
          "content":content
       },
        "msgtype":"text"
    };
    var access_token = result.data.access_token;
    request.post({
      url: url + access_token,
      form: JSON.stringify(form)
    },function(error,httpResponse,body){
      if(!error){
        return res.status(200).send(JSON.parse(body));
      }
      return res.status(500).send('群发消息失败');
    });
  });
});
//查看群发消息状态
router.post('/request_send_all_status',function(req,res,next){
  var msgId = req.body.msgId;
  var url = 'https://api.weixin.qq.com/cgi-bin/message/mass/get?access_token=';
  util.getToken(aotuConfig, function(result){
    if(result.err){
      return res.status(500).send(result.msg);
    }
    var form = {
     "msg_id":msgId
    }

    var access_token = result.data.access_token;
    request.post({
      url: url + access_token,
      form: JSON.stringify(form)
    },function(error,httpResponse,body){
      if(!error){
        return res.status(200).send(JSON.parse(body));
      }

      return res.status(500).send('查看群发消息失败');
    })
  });
});

router.post('/qrcode_create',function(req,res,next){
  var url = 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=';
  util.getToken(aotuConfig, function(result){
    if(result.err){
      return res.status(500).send(result.msg);
    }

    var access_token = result.data.access_token;
    request.post({
      url: url + access_token,
      form: JSON.stringify({"expire_seconds": 604800, "action_name": "QR_SCENE", "action_info": {"scene": {"scene_id": 517}}})
    },function(error,httpResponse,body){
      if(!error){
        return res.status(200).send(JSON.parse(body));
      }

      return res.status(500).send('生成二维码失败');
    })
  });
});

router.get("/media_list", function(req,res,next) {
  var url = 'https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=';
  util.getToken(aotuConfig, function(result){
    if(result.err){
      return res.status(500).send(result.msg);
    }

    var query = req.query;
    if (!query.type || query.type.length == 0) {
      query.type = "image"
    }
    if (!query.offset || query.offset.length == 0) {
      query.offset = 1
    }
    if (!query.count || query.count.length == 0) {
      query.count = 100
    }
    var access_token = result.data.access_token;
    request.post({
      url: url + access_token,
      form: JSON.stringify(query)
    },function(error,httpResponse,body){
      if(!error){
        return res.status(200).send(JSON.parse(body));
      }

      return res.status(500).send('获取素材失败');
    })
  });
});

module.exports = router;
