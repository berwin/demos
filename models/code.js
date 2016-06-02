/**!
 * Demos - models/code.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var base = require('./base.js');
var db = base.getCollection('code');

exports.insertCode = function (data, callback) {
  db.insert(data, callback);
};

exports.updateCode = function (id, data, callback) {
  db.findAndModify({_id: id}, [], {$set: data}, {upsert: true, new: true}, callback);
};

exports.getCodeById = function (id, callback) {
  db.findOne({_id: id}, callback);
};

exports.getDemosByUserID = function (userID, callback) {
  db.find({userID : userID}).toArray(callback);
};

exports.rmCodeById = function (id, callback) {
  db.remove({_id: id}, callback);
};