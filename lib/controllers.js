'use strict';
var ObjectID = require( './db/mongo' ).ObjectID;
var pageCode = require( './module/pageCode' );

exports.home = function( req, res ){
    var id = ObjectID().toString();
    res.render( 'index', { id : id } );
};

exports.edit = function( req, res ){
    pageCode.getEditCode( req.params.id, function( err, data ){
        res.render( 'edit', { data : data || {} } );
    } );
};

exports.result = function( req, res ){
    pageCode.getResultCode( req.params.id, function( err, result ){
        result ? res.send( result.codeText || '<!doctype html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>Demos</title>\n</head>\n<body>\n    \n</body>\n</html>' ) : res.send( '<!doctype html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>Demos</title>\n</head>\n<body>\n    \n</body>\n</html>' );
    } );
};

exports.createCode = function( req, res ){
    pageCode.createCode( req.body, function( err, result ){
        res.send( result );
    } );
}