'use strict';
var code = require( '../db/code' );

exports.insertCode = function( data, callback ){
    if( data.id && data.code && data.title ){
        var time = new Date().getTime();
        code.insertCode( { _id : data.id, title : data.title, code : data.code, time : time }, callback );
    }
};