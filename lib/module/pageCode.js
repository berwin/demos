'use strict';
var codeDB = require( '../db/codeDB' );
var ObjectID = require( '../db/mongo' ).ObjectID;

exports.createCode = function (data, callback) {
    if( data.id && data.codeText && data.type ){
        var time = new Date().getTime();
        codeDB.getCodeById( data.id, function( err, result ){
            if( !err && !result ){
                codeDB.insertCode( { _id : data.id, codeText : data.codeText, type : data.type, userID : data.userID, firstTime : time, lastTime : time }, function( err, result ){
                    callback( err, result[0], 0 );
                } );
            }
            if( result && result.userID === data.userID ){
                codeDB.updateCode( data.id, { codeText : data.codeText, lastTime : time }, function( err, result ){
                    callback( err, result, 1 );
                } );
            }
            if( result && result.userID !== data.userID ){
                codeDB.insertCode( { _id : ObjectID().toString(), codeText : data.codeText, type : data.type, userID : data.userID, firstTime : time, lastTime : time }, function( err, result ){
                    callback( err, result[0], 2 );
                } );
            }
        } );
    }
};

exports.getCodeById = function (id, callback) {
    codeDB.getCodeById( id, callback );
};

exports.getDemosByUserID = function (userID, callback) {
    codeDB.getDemosByUserID( userID, callback );
};

exports.rmCodeById = function (id, callback) {
    id && codeDB.rmCodeById(id, callback);
};