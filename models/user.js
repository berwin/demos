/**!
 * Demos - models/user.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var base = require('./base.js');
var db = base.getCollection('user');

/*
 * 插入数据到 user collection 中
 *
 * @param {Object} 要插入的数据
 * @return {Object} 插入后的数据
 */
exports.insert = function (data) {
  return function (done) {
    db.insert(data, done);
  }
};

/*
 * 获取用户数据
 *
 * @param {String} Email
 * @return {Object} 用户数据
 */
exports.getUserByMail = function (mail) {
  return function (done) {
    db.findOne({mail: mail}, done);
  }
};

/*
 * 获取用户数据
 *
 * @param {String} userID
 * @return {Object} 用户数据
 */
exports.getUserById = function (id) {
  return function (done) {
    db.findOne({_id: id}, done);
  }
};

/*
 * 修改用户数据
 *
 * @param {String} Email
 * @param {Object} 要修改的数据
 * @return {Object} 修改后的数据
 */
exports.updateUserByMail = function (mail, data) {
  return function (done) {
    db.findAndModify({mail: mail}, [], {$set: data}, {new: true}, done);
  }
};

/*
 * 修改用户数据
 *
 * @param {String} userID
 * @param {Object} 要修改的数据
 * @return {Object} 修改后的数据
 */
exports.updateUserById = function (id, data) {
  return function (done) {
    db.findAndModify({_id: id}, [], {$set: data}, {new: true}, done);
  }
};