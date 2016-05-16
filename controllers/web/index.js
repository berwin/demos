/**!
 * Demos - controller/web/index.js
 *
 * 用来渲染web页面的 controller
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

exports.index = function* () {
  yield this.render('index');
};