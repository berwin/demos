'use strict';
var ObjectID = require( './db/mongo' ).ObjectID;
var pageCode = require( './module/pageCode' );
var tool = require( './tool' );
var config = require( '../config' );

exports.home = function( req, res ){
    var id = ObjectID().toString();
    // res.render( 'index', { id : id } );
    res.redirect( '/' + id );
};

exports.edit = function( req, res ){
    var passMd5 = tool.getMd5( req.params.id + config.MD5_SUFFIX );
    if( !req.cookies[ 'demos_session' ] ){
        res.cookie( 'demos_session', ObjectID().toString(), { expires: new Date(Date.now() + 86400000*30), httpOnly: true  });
    }
    res.cookie( passMd5, 1, { expires: new Date(Date.now() + 86400000), httpOnly: true  });
    res.render( 'edit', { data : { _id : req.params.id } } );
};

exports.result = function( req, res ){
    pageCode.getCodeById( req.params.id, function( err, result ){
        var str = '<!doctype html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>Demos</title>\n</head>\n<body>\n    \n</body>\n</html>';
        result ? res.send( result.codeText || str ) : res.send( str );
    } );
};

exports.createCode = function( req, res ){
    var passMd5 = tool.getMd5( req.body.id + config.MD5_SUFFIX );
    if( req.cookies[ passMd5 ] && req.cookies[ 'demos_session' ] ){
        req.body.userID = req.cookies[ 'demos_session' ];

        pageCode.createCode( req.body, function( err, result, saveAS ){
            if( saveAS ){
                res.send( { status : 1, data : result } );
            }else{
                res.send( { status : 0, data : result } );
            }
        } );
    }else{
        res.send( { status : -1, msg : 'not cookie' } );
    }
}

exports.getDemosByUserID = function (req, res) {
    var userID = req.cookies[ 'demos_session' ];
    pageCode.getDemosByUserID( userID, function (err, list) {
        err ? res.status( 500 ).send( err ) : res.send( list );
    });
};