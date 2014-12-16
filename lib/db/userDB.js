'use strict';

var mongo = require( './mongo' );
var userDB = mongo.getCollection( 'user' );
var ObjectID = require( './mongo' ).ObjectID;

exports.insert = function (data, callback) {
    data._id = ObjectID().toString();
    userDB.insert( data, callback );
};

exports.getUserByMail = function (mail, callback) {
    userDB.find( {mail: mail} ).toArray( callback );
};
