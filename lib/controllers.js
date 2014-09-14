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
        result ? res.send( result.codeText || '' ) : res.send( '' );
    } );
};

exports.createCode = function( req, res ){
    pageCode.createCode( req.body, function( err, result ){
        res.send( result );
    } );
}