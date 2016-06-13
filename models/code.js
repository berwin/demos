/**!
 * Demos - models/code.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var base = require('./base.js');
var db = base.getCollection('code');

/*
 * 插入数据到 code collection 中
 *
 * @param {Object} 要插入的数据
 * @return {Object} 插入后的数据
 */
exports.insertCode = function (data) {
  return function (done) {
    db.insert(data, done);
  }
};

/*
 * 通过 codeID 修改数据
 *
 * @param {String} codeID
 * @param {Object} 想修改的数据
 * @return {Object} 修改后的数据
 */
exports.updateCodeById = function (id, data) {
  return function (done) {
    db.findAndModify({_id: id}, [], {$set: data}, {upsert: true, new: true}, done);
  }
};

/*
 * 获取code信息
 *
 * @param {String} codeID
 * @return {Object} code相关信息
 */
exports.getCodeById = function (id) {
  return function (done) {
    db.findOne({_id: id}, done);
  }
};

/*
 * 获取code列表
 *
 * @param {String} usreID
 * @return {Array} code列表
 */
exports.getCodesByUserId = function (userID) {
  return function (done) {
    db.find({userID : userID}).toArray(done);
  }
};

/*
 * 删除数据
 *
 * @param {String} codeID
 */
exports.rmCodeById = function (id) {
  return function (done) {
    db.remove({_id: id}, done);
  }
};