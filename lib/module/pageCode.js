'use strict';
var codeDB = require( '../db/codeDB' );
var ObjectID = require( '../db/mongo' ).ObjectID;

exports.createCode = function( data, callback ){
    if( data.id && data.codeText ){
        var time = new Date().getTime();
        codeDB.getCodeById( data.id, function( err, result ){
            if( !err && !result ){
                codeDB.insertCode( { _id : data.id, codeText : data.codeText, userID : data.userID, firstTime : time, lastTime : time }, function( err, result ){
                    callback( err, result[0], false );
                } );
            }
            if( result && result.userID === data.userID ){
                codeDB.updateCode( data.id, { codeText : data.codeText, lastTime : time }, function( err, result ){
                    callback( err, result, false );
                } );
            }
            if( result && result.userID !== data.userID ){
                codeDB.insertCode( { _id : ObjectID().toString(), codeText : data.codeText, userID : data.userID, firstTime : time, lastTime : time }, function( err, result ){
                    callback( err, result[0], true );
                } );
            }
        } );
    }
};

exports.getCodeById = function( id, callback ){
    codeDB.getCodeById( id, callback );
};