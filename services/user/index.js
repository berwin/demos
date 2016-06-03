/**!
 * Demos - services/user/index.js
 *
 * 用户相关的操作
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var userModel = require(process.env.PWD + '/models/user.js');

exports.active = function *(mail) {
  if (!mail) throw new Error('no mail');
  return yield userModel.updateUserByMail(mail, {activate: true});
};

exports.getUserByMail = function *(mail) {
  if (!mail) throw new Error('no mail');
  return yield userModel.getUserByMail(mail);
};

exports.insert = function *(userId, mail, password) {
  if (!userId || !mail || !password) throw new Error('no userId or mail or password');
  return yield userModel.insert({_id: userId, mail: mail, password: password, created: new Date().getTime(), activate: false});
};

exports.getUserById = function *(userID) {
  if (!userID) throw new Error('no userID');
  return yield userModel.getUserById(userID);
};

exports.updatePasswordById = function *(userID, password) {
  if (!userID || !password) throw new Error('no userID or password');
  return yield userModel.updateUserById(userID, {password: password});
};