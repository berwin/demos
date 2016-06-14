/**!
 * Demos - controller/api/user.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var userService = require('../../services/user/index.js');
var helper = require('../../helper/index.js');
var config = require('../../config/index.js');

exports.login = function *() {
  var mail = this.request.body.mail;
  var password = this.request.body.password;
  var pass = helper.getMd5(password + config.md5_suffix);

  var userInfo = yield *userService.getUserByMail(mail);

  if (userInfo === null) {
    this.status = 403;
    return this.body = '用户不存在';
  }

  if (userInfo.password !== pass) {
    this.status = 403;
    return this.body = '密码不正确';
  }

  if (userInfo.activate === false) {
    this.status = 403;
    return this.body = '您的账户未激活，请在邮件里点击按钮激活此账户';
  }

  var avatarID = helper.getMd5(mail);
  userInfo.avatar = 'http://en.gravatar.com/avatar/'+ avatarID +'?size=100';

  this.cookies.set('demos_session', userInfo._id);
  this.cookies.set('login_session', helper.getMd5(userInfo._id + config.md5_suffix), {httpOnly: false});
  this.cookies.set('userID', userInfo._id, {expires: new Date(Date.now() + 86400000*30), httpOnly: false});

  this.body = userInfo;
};

exports.register = function *() {
  var mail = this.request.body.mail;
  var password = this.request.body.password;
  var userID = this.cookies.get('demos_session');

  if (!mail || !password || !userID) {
    this.status = 403;
    return this.body = 'not mail password demos_session';
  }

  var passMd5 = helper.getMd5(mail + config.md5_suffix);
  var link = config.hostname + '/activate/'+ mail +'/'+ passMd5;
  var html = '<!doctype html><html><head><meta charset="UTF-8"><title>Demos</title><style>#mail{font:14px/200% "";background:#fff;}#mail a{display:inline-block;width:300px;height:60px;font:18px/60px "";background:#3498db;border-radius:5px;text-align:center;color:#fff;text-decoration:none;transition:.2s linear;}#mail a:hover{background:#5dade2;}#mail a:active{background:#2980B9;}</style></head><body><div id="mail"><h1>欢迎光临 Demos</h1><p>感谢您注册了Demos，体验更全面的功能。验证您的电子邮件地址，请点击下面的链接。</p><a href="'+ link +'">邮箱验证</a><p>请注意，如果不激活,这个链接会在24小时内过期。</p><p>快乐的编写代码</p><p>Berwin</p></div></body></html>';

  var userInfo = yield *userService.getUserByMail(mail);

  if (userInfo !== null) {
    this.status = 403;
    return this.body = '该账户已注册';
  }

  var result = yield *userService.insert(userID, mail, helper.getMd5(password + config.md5_suffix));

  try {
    yield helper.sendMail(mail, '激活您的Demos账户', html);
  } catch(e) {
    this.status = 500;
    this.body = '发送邮件时，发送了错误';
  }

  this.body = result.ops[0];
};

exports.getUserInfo = function *() {
  var userID = this.cookies.get('demos_session');
  var login_session = this.cookies.get('login_session');
  var pass = helper.getMd5(userID + config.md5_suffix);

  if (login_session !== pass) {
    this.status = 403;
    this.body = 'not demos_session or login_session';
  }

  var userInfo = yield *userService.getUserById(userID);
  userInfo.avatar = 'http://en.gravatar.com/avatar/'+ helper.getMd5(userInfo.mail) +'?size=100';

  this.body = userInfo;
};

exports.changepw = function *() {
  var userID = this.cookies.get('demos_session');
  var password = this.request.body.password;

  try {
    var result = yield *userService.updatePasswordById(userID, helper.getMd5(password + config.md5_suffix));
    this.body = result.value;
  } catch(e) {
    console.error(e);
    this.status = 500;
    this.body = '密码修改失败';
  }
};

exports.retrieve = function *() {
  var mail = this.request.body.mail;
  var password = helper.randomPassword(6, 'na');
  var userInfo = yield *userService.getUserByMail(mail);

  if (userInfo === null) {
    this.status = 403;
    return this.body = '没有该账户';
  }

  try {
    yield *userService.updatePasswordById(userInfo._id, helper.getMd5(password + config.md5_suffix));
  } catch(e) {
    this.status = 500;
    this.body = '密码找回失败，可能是在修改代码的时候出现了错误';
  }

  var html = '<!doctype html><html><head><meta charset="UTF-8"><title>Demos</title><style>.mail_p{font:14px/200% "";}</style></head><body><style>.mail_p{font:14px/200% "";}</style><p class="mail_p">您的demos登录密码为：'+ password +'，请妥善保管您的密码</p></body></html>';
  try {
    yield helper.sendMail(mail, 'Demos密码找回', html);
  } catch(e) {
    console.error(e);
    this.status = 500;
    this.body = '密码找回失败，可能是在发送邮件的过程中出现了错误';
  }

  this.body = '';
};

exports.signout = function *() {
  this.cookies.set('login_session', '', {httpOnly: false});
  this.body = '';
};