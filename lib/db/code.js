'use strict';
var mongo = require( './mongo' );

var code = mongo.getCollection( 'code' );

exports.insertCode = function( data, callback ){
    code.iinsert( data, callback );
};