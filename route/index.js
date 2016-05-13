/**!
 * Demos - route/index.js
 *
 * 主路由，主要用来为不同业务添加路由前缀
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var Router = require('koa-router');
var forums = new Router();
var webRoute = require('./web_route.js');

forums.use(webRoute.routes());

module.exports = forums;