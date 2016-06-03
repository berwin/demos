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
var set_session = require('../middleware/set_session.js');

router.get('/', webCtrl.home);
router.get('/html', webCtrl.redirectHtml);
router.get('/js', webCtrl.redirectJs);
router.get('/html/:id', set_session, webCtrl.edit);
router.get('/js/:id', set_session, webCtrl.editJS);
router.get('/result/:id', webCtrl.result);
router.get('/activate/:mail/:md5', webCtrl.activate);

module.exports = router;