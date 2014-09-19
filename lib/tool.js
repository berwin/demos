'use strict';
var crypto = require('crypto');

exports.getMd5 = function( str ){
    if( str ){
        var md5 = crypto.createHash('md5');
        var result = md5.update( str ).digest('hex');
        return result;
    }else{
        return '';
    }
};