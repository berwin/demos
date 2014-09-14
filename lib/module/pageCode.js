'use strict';
var codeDB = require( '../db/codeDB' );

exports.createCode = function( data, callback ){
    if( data.id && data.codeText ){
        var time = new Date().getTime();
        codeDB.getCodeById( data.id, function( err, result ){
            if( !err && !result ){
                codeDB.insertCode( { _id : data.id, codeText : data.codeText, time : time }, callback );
            }
            if( result ){
                codeDB.updateCode( data.id, { codeText : data.codeText, time : time }, callback );
            }
        } );
    }
};

exports.getEditCode = function( id, callback ){
    codeDB.getCodeById( id, function( err, result ){
        if( err ){
            callback( err );
        }else if( result ){
            result.codeText = result.codeText.replace( /\n/g, '\\n' );
            callback( null, result );
        }else{
            callback( null, { _id : id } );
        }
    } );
};

exports.getResultCode = function( id, callback ){
    codeDB.getCodeById( id, callback );
};