/**!
 * Demos - app.js
 *
 * 项目入口文件
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

var app = require('koa')();
var path = require('path');
var logger = require('koa-logger');
var serve = require('koa-static');
var bodyParser = require('koa-bodyparser');
var render = require('koa-ejs');
var route = require('./routes/index.js');
var config = require('./config/index.js');

// 注册中间件
app.use(logger());
app.use(serve(path.join(__dirname, 'public')));
app.use(bodyParser());

render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: true
});

app.use(route.routes());

if (!module.parent) {
  var server = app.listen(config.port, function () {
    console.info(`Demos listening on port ${config.port}`);
    console.info(`God bless love....`);
    console.info(`You can debug your app with http://127.0.0.1:${config.port}`);
    console.info('');
  });
}

module.exports = app;