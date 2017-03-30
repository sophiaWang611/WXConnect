'use strict';
var domain = require('domain');
var express = require('express');
var path = require('path');
var _ = require("underscore");
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var wx = require('./routes/wxrouter');
var api = require('./routes/api');
var config = require('./config/config');

function getToken() {
  var targetToken = config.wx_config.aotu.token;
  var rang = _.range(50);
  _.each(rang,function (i) {
    var hash = crypto.createHash('sha256');
    hash.update(targetToken);
    targetToken = hash.digest('hex');
  });
  return targetToken;
}

const TARGET_TOKEN = getToken();
console.log("getToken", TARGET_TOKEN);

var app = express();

// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// 未处理异常捕获 middleware
app.use(function(req, res, next) {
  var d = null;
  if (process.domain) {
    d = process.domain;
  } else {
    d = domain.create();
  }
  d.add(req);
  d.add(res);
  d.on('error', function(err) {
    console.error('uncaughtException url=%s, msg=%s', req.url, err.stack || err.message || err);
    if (!res.finished) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      res.end('uncaughtException');
    }
  });
  d.run(next);
});

app.use(function(req, res, next) {
  var token = req.query.token || "";

  if (new RegExp("^/api").test(req.url) && token != TARGET_TOKEN) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json; charset=UTF-8');
    res.end('unAutherized');
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.render('index', {
    currentTime: new Date()
  });
});

app.use('/wx', wx);
app.use('/api',api);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var statusCode = err.status || 500;
    if (statusCode === 500) {
      console.error(err.stack || err);
    }
    res.status(statusCode);
    res.render('error', {
      message: err.message || err,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message || err,
    error: {}
  });
});

module.exports = app;
