'use strict';
var ObjectID = require( './db/mongo' ).ObjectID;
var code = require( './module/code' );

exports.home = function( req, res ){
    var id = ObjectID().toString();
    res.render( 'index', { id : id } );
};

exports.edit = function( req, res ){
    res.render( 'edit' );
};

exports.result = function( req, res ){};

exports.codeCont = function( req, res ){
    console.log( req.body );
    code.insertCode( req.body, function( err, result ){
        res.send( result );
    } );
}