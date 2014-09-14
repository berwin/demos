'use strict';
var mongo = require( './mongo' );

var codeDB = mongo.getCollection( 'code' );

exports.updateCode = function( data, callback ){
    codeDB.findAndModify( { _id : data._id }, [], { $set : data }, { upsert : true, new : true }, callback );
};

exports.getCodeById = function( id, callback ){
    codeDB.findOne( { _id : id }, callback );
};