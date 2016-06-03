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
var userService = require(process.env.PWD + '/services/user/index.js');
var ObjectID = require(process.env.PWD + '/models/base.js').ObjectID;
var helper = require(process.env.PWD + '/helper/index.js');
var config = require(process.env.PWD + '/config/index.js');

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

exports.activate = function *() {
  var mail = this.params.mail;
  var passMd5 = this.params.md5;
  var newPassMd5 = helper.getMd5(mail + config.md5_suffix);

  if (passMd5 === newPassMd5) {
    var result = yield *userService.active(mail);
    yield this.render('activate', {mail: mail});
  } else {
    this.status = 404;
    this.body = 'Incorrect parameters';
  }
};