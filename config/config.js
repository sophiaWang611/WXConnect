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
          "url": "https://yry-h5.mishi.cn/goods/team"
        },{
          "name": "溯源",
          "sub_button": [{
            "name": "日签·历",
            "type": "view",
            "url": "https://yry-h5.mishi.cn/static/imgList"
          },{
            "name": "餐品说明",
            "type": "view",
            "url": "https://yry-h5.mishi.cn/static/goodsDesc"
          },{
            "name": "配送范围",
            "type": "view",
            "url": "https://yry-h5.mishi.cn/static/delivery"
          }]
        },{
          "name": "订单",
          "type": "view",
          "url": "https://yry-h5.mishi.cn/order/list"
        }]
      },
      subscribe: "么么哒，终于等到你啦！觅食君已经备好各种美味！",
      subscribeMediaId: "100000033",
      unsubscribe: ""
    }
  }
};
