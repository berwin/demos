'use strict';
var config = require( '../../config' );
var mongoskin = require( 'mongoskin' );

var db = null;

exports.getCollection = function( collectionName ){
    if( !db ) db = mongoskin.db( config.MONGO_RUL, {native_parser:true} );
    return db.collection( collectionName );
};

exports.ObjectID = mongoskin.ObjectID;