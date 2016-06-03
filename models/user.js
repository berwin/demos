/**!
 * Demos - models/user.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var base = require('./base.js');
var db = base.getCollection('user');

exports.insert = function (data) {
  return function (done) {
    db.insert(data, done);
  }
};

exports.getUserByMail = function (mail) {
  return function (done) {
    db.findOne({mail: mail}, done);
  }
};

exports.updateUserByMail = function (mail, data) {
  return function (done) {
    db.findAndModify({mail: mail}, [], {$set: data}, {new: true}, done);
  }
};

exports.updateUserById = function (id, data) {
  return function (done) {
    db.findAndModify({_id: id}, [], {$set: data}, {new: true}, done);
  }
};

exports.getUserById = function (id) {
  return function (done) {
    db.findOne({_id: id}, done);
  }
};