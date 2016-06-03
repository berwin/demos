/**!
 * Demos - models/code.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var base = require('./base.js');
var db = base.getCollection('code');

exports.insertCode = function (data) {
  return function (done) {
    db.insert(data, done);
  }
};

exports.updateCodeById = function (id, data) {
  return function (done) {
    db.findAndModify({_id: id}, [], {$set: data}, {upsert: true, new: true}, done);
  }
};

exports.getCodeById = function (id) {
  return function (done) {
    db.findOne({_id: id}, done);
  }
};

exports.getCodesByUserId = function (userID) {
  return function (done) {
    db.find({userID : userID}).toArray(done);
  }
};

exports.rmCodeById = function (id) {
  return function (done) {
    db.remove({_id: id}, done);
  }
};