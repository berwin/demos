/**!
 * Demos - controller/web/index.js
 *
 * 用来渲染web页面的 controller
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var codeService = require('../../services/code/index.js');
var userService = require('../../services/user/index.js');
var ObjectID = require('../../models/base.js').ObjectID;
var helper = require('../../helper/index.js');
var config = require('../../config/index.js');

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
  yield this.render('html/index', {data :{_id: this.params.id}});
};

exports.editJS = function *() {
  yield this.render('js/index', {data: {_id: this.params.id}});
};

exports.result = function *() {
  var result = yield *codeService.getCodeById(this.params.id);
  this.body = result ? result.code : '404';
};

exports.activate = function *() {
  var mail = this.params.mail;
  var passMd5 = this.params.md5;
  var newPassMd5 = helper.getMd5(mail + config.md5_suffix);

  if (passMd5 === newPassMd5) {
    var result = yield *userService.active(mail);
    yield this.render('other/activate', {mail: mail});
  } else {
    this.status = 404;
    this.body = 'Incorrect parameters';
  }
};