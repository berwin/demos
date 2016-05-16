/**!
 * Demos - route/web_route.js
 *
 * 子路由，用来渲染web页面的路由
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var router = require('koa-router')();
var webCtrl = require('../controllers/web/index.js');

router.get('/', webCtrl.index);

module.exports = router;