'use strict';
var mongo = require( './mongo' );

var codeDB = mongo.getCollection( 'code' );

exports.insertCode = function (data, callback) {
    codeDB.insert( data, callback );
};

exports.updateCode = function (id, data, callback) {
    codeDB.findAndModify( { _id : id }, [], { $set : data }, { upsert : true, new : true }, callback );
};

exports.getCodeById = function (id, callback) {
    codeDB.findOne( { _id : id }, callback );
};

exports.getDemosByUserID = function (userID, callback) {
    codeDB.find({userID : userID}).toArray(callback);
};