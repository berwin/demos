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
    if (!req.cookies[ 'demos_session' ]) {
        res.cookie( 'demos_session', ObjectID().toString(), { expires: new Date(Date.now() + 86400000*30), httpOnly: true  });
    }
    if (!req.cookies[ passMd5 ]) {
        res.cookie( passMd5, 1, { expires: new Date(Date.now() + 86400000), httpOnly: true  });
    }
    res.render( 'edit', { data : { _id : req.params.id } } );
};

exports.result = function( req, res ){
    pageCode.getCodeById( req.params.id, function( err, result ){
        var str = '<!doctype html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>Demos</title>\n</head>\n<body>\n    \n</body>\n</html>';
        result ? res.send( result.codeText || str ) : res.send( str );
    } );
};

exports.postAll = function (req, res, next) {
    var passMd5 = tool.getMd5( req.body.id + config.MD5_SUFFIX );
    if( req.cookies[ passMd5 ] ){
        next();
    }else{
        res.status( 404 ).send('not cookie pass');
    }
};

exports.createCode = function( req, res ){
    if( req.cookies[ 'demos_session' ] ){
        req.body.userID = req.cookies[ 'demos_session' ];

        pageCode.createCode( req.body, function( err, result, status ){
            res.send( { status : status, data : result } );
        } );
    }else{
        res.status( 404 ).send('not cookie demos_session userID)');
    }
}

exports.getDemosByUserID = function (req, res) {
    var userID = req.cookies[ 'demos_session' ];
    pageCode.getDemosByUserID( userID, function (err, list) {
        err ? res.status( 500 ).send( err ) : res.send( list );
    });
};

exports.login = function (req, res) {
    var mail = req.body.mail;
    var password = req.body.password;
    var userID = '12345678';
    if( mail === 'berwin1995@qq.com' && password === '111' ){
        res.cookie( 'demos_vip', userID, {httpOnly: true} );
        res.send();
    }else{
        res.status( 404 ).send( 'The user name or password is not correct' );
    }
};




