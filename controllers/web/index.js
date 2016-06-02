/**!
 * Demos - controller/web/index.js
 *
 * 用来渲染web页面的 controller
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var codeService = require(process.env.PWD + '/services/code/index.js');
var ObjectID = require(process.env.PWD + '/models/base.js').ObjectID;

exports.home = function *() {
  yield this.render('index');
};

exports.redirectHtml = function *() {
  var id = ObjectID().toString();
  this.redirect('/html/' + id);
};

exports.redirectJs = function *() {
  var id = ObjectID().toString();
  this.redirect('/js/' + id);
};

exports.edit = function *() {
  yield this.render('edit-html', {data :{_id: this.params.id}});
};

exports.editJS = function *() {
  yield this.render('edit-js', {data: {_id: this.params.id}});
};

exports.result = function *() {
  var result = yield *codeService.getCodeById(this.params.id);
  this.body = result ? result.codeText : '404';
};