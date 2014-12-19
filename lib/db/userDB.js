'use strict';

var mongo = require( './mongo' );
var userDB = mongo.getCollection( 'user' );

exports.insert = function (data, callback) {
    userDB.insert( data, callback );
};

exports.getUserByMail = function (mail, callback) {
    userDB.findOne( {mail: mail}, callback );
};

exports.updateUserByMail = function (mail, data, callback) {
    userDB.findAndModify( { mail : mail }, [], { $set : data }, { new : true }, callback );
};

exports.getUserById = function (id, callback) {
    userDB.findOne( {_id: id}, callback );
};