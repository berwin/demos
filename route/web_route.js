/**!
 * Demos - route/web_route.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var router = require('koa-router')();
var webCtrl = require('../controller/web/index.js');

router.get('/', webCtrl.index);

module.exports = router;