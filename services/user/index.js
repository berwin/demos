/**!
 * Demos - services/user/index.js
 *
 * 用户相关的操作
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var userModel = require('../../models/user.js');

/*
 * 激活账号
 *
 * @param {String} Email
 * @return {Object} 激活后的用户数据
 */
exports.active = function *(mail) {
  if (!mail) throw new Error('no mail');
  return yield userModel.updateUserByMail(mail, {activate: true});
};

/*
 * 根据 Email 获取用户信息
 *
 * @param {String} Email
 * @return {Object} 用户数据
 */
exports.getUserByMail = function *(mail) {
  if (!mail) throw new Error('no mail');
  return yield userModel.getUserByMail(mail);
};

/*
 * 创建新账号
 * 之所以创建账号之前就已经有用户ID是因为 这个系统可以允许未注册的用户操作，所以未注册的用户会给一个临时的用户ID，所以在创建账号之前，就已经存在了一个临时的用户ID
 *
 * @param {String} 用户ID
 * @param {String} Email
 * @param {String} 密码
 * @return {Object} 用户数据
 */
exports.insert = function *(userId, mail, password) {
  if (!userId || !mail || !password) throw new Error('no userId or mail or password');
  return yield userModel.insert({_id: userId, mail: mail, password: password, created: new Date().getTime(), activate: false});
};

/*
 * 根据 userID 获取用户信息
 *
 * @param {String} 用户ID
 * @return {Object} 用户数据
 */
exports.getUserById = function *(userID) {
  if (!userID) throw new Error('no userID');
  return yield userModel.getUserById(userID);
};

/*
 * 修改密码
 *
 * @param {String} 用户ID
 * @param {String} 新密码
 * @return {Object} 更新后的数据
 */
exports.updatePasswordById = function *(userID, password) {
  if (!userID || !password) throw new Error('no userID or password');
  return yield userModel.updateUserById(userID, {password: password});
};