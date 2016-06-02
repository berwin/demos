/**!
 * Demos - models/user.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var base = require('./base.js');
var db = base.getCollection('user');

exports.insert = function (data, callback) {
  db.insert(data, callback);
};

exports.getUserByMail = function (mail, callback) {
  db.findOne({mail: mail}, callback);
};

exports.updateUserByMail = function (mail, data, callback) {
  db.findAndModify({mail: mail}, [], {$set: data}, {new: true}, callback);
};

exports.getUserById = function (id, callback) {
  db.findOne({_id: id}, callback);
};