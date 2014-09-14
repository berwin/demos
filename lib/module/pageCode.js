'use strict';
var codeDB = require( '../db/codeDB' );

exports.createCode = function( data, callback ){
    if( data.id && data.codeText ){
        var time = new Date().getTime();
        codeDB.updateCode( { _id : data.id, codeText : data.codeText, time : time }, callback );
    }
};

exports.getEditCode = function( id, callback ){
    codeDB.getCodeById( id, function( err, result ){
        if( err ){
            callback( err );
        }else{
            result.codeText = result.codeText.replace( /\n/g, '\\n' );
            callback( null, result );
        }
    } );
};

exports.getResultCode = function( id, callback ){
    codeDB.getCodeById( id, callback );
};