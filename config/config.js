module.exports = {
  wx_config: {
    aotu: {
      token: 'WXConnect',
      appid: '',
      secret: '',
      cached: {},
      menu: {
        "button": [{
          "name": "点餐",
          "type": "view",
          "url": "http://www.cnblogs.com/tom-zhu"
        }, {
          "name": "溯源",
          "sub_button": [{
            "type": "view",
            "name": "日签·历",
            "url": "http://www.cnblogs.com/tom-zhu"
          },{
            "type": "view",
            "name": "日签·历",
            "url": "http://www.cnblogs.com/tom-zhu"
          },{
            "type": "view",
            "name": "日签·历",
            "url": "http://www.cnblogs.com/tom-zhu"
          }]
        },{
          "name": "订单",
          "type": "view",
          "url": "http://www.cnblogs.com/tom-zhu"
        }]
      }
    }
  }
};
