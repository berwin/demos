'use strict';
var ObjectID = require( './db/mongo' ).ObjectID;
var pageCode = require( './module/pageCode' );
var pageUser = require( './module/pageUser' );
var tool = require( './tool' );
var config = require( '../config' );

/****************** GET ******************/

exports.home = function (req, res) {
    var id = ObjectID().toString();
    // res.render( 'index', { id : id } );
    res.redirect( '/' + id );
};

exports.edit = function (req, res) {
    var passMd5 = tool.getMd5( req.params.id + config.MD5_SUFFIX );
    if (!req.cookies[ passMd5 ]) {
        res.cookie( passMd5, 1, { expires: new Date(Date.now() + 86400000), httpOnly: true  });
    }
    if (!req.cookies[ 'demos_session' ]) {
        res.cookie( 'demos_session', ObjectID().toString(), { expires: new Date(Date.now() + 86400000*30), httpOnly: true  });
    }
    res.render( 'edit', { data : { _id : req.params.id } } );
};

exports.result = function (req, res) {
    pageCode.getCodeById( req.params.id, function( err, result ){
        var str = '<!doctype html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>Demos</title>\n</head>\n<body>\n    \n</body>\n</html>';
        result ? res.send( result.codeText || str ) : res.send( str );
    } );
};

exports.activate = function (req, res) {
    var mail = req.params.mail;
    var passMd5 = req.params.md5;
    var newPassMd5 = tool.getMd5( mail + config.MD5_SUFFIX );
    if( passMd5 === newPassMd5 ){
        pageUser.activeUser(mail, function (err, result) {
            if( err ) res.status( 500 ).send(err);
            if( !err ) res.render( 'activate', { mail : mail } );
        });
    }else{
        res.status( 404 ).send('Incorrect parameters');
    }
};
/****************** End GET ******************/

/****************** POST ******************/

exports.postAll = function (req, res, next) {
    var passMd5 = tool.getMd5( req.body.id + config.MD5_SUFFIX );
    if( req.cookies[ passMd5 ] ){
        next();
    }else{
        res.status( 403 ).send('not cookie pass');
    }
};

exports.createCode = function (req, res) {
    if( req.cookies[ 'demos_session' ] ){
        req.body.userID = req.cookies[ 'demos_session' ];

        pageCode.createCode( req.body, function( err, result, status ){
            res.send( { status : status, data : result } );
        } );
    }else{
        res.status( 403 ).send('not cookie demos_session userID)');
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
    pageUser.login(mail, password, function (err, result) {
        if( err ){
            res.status( 500 ).send( err );
        }else{
            var pass = tool.getMd5( result._id + config.MD5_SUFFIX );
            var str = tool.getMd5( result.mail );
            result && ( result.avatar = 'http://en.gravatar.com/avatar/'+ str +'?size=100' );
            res.cookie( 'demos_session', result._id, {httpOnly: true} );
            res.cookie( 'login_session', pass );
            res.send(result);
        }
    });
};

exports.postRegister = function (req, res) {
    var mail = req.body.mail;
    var password = req.body.password;
    var demos_session = req.cookies[ 'demos_session' ];
    if (mail && password && demos_session) {
        var passMd5 = tool.getMd5( mail + config.MD5_SUFFIX );
        var link = config.HOSTNAME + '/activate/'+ mail +'/'+ passMd5;
        var html = '<!doctype html><html><head><meta charset="UTF-8"><title>Demos</title><style>#mail{font:14px/200% "";background:#fff;}#mail a{display:inline-block;width:300px;height:60px;font:18px/60px "";background:#3498db;border-radius:5px;text-align:center;color:#fff;text-decoration:none;transition:.2s linear;}#mail a:hover{background:#5dade2;}#mail a:active{background:#2980B9;}</style></head><body><div id="mail"><h1>欢迎光临 Demos</h1><p>感谢您注册了Demos，体验更全面的功能。验证您的电子邮件地址，请点击下面的链接。</p><a href="'+ link +'">邮箱验证</a><p>请注意，如果不激活,这个链接会在24小时内过期。</p><p>快乐的编写代码</p><p>Berwin</p></div></body></html>';

        pageUser.register(mail, password, demos_session, function (err, result) {
            if( result ){
                tool.sendMail(mail, html, function(error, info){
                    if(error){
                        res.status(500).send('发送邮件时，发送了错误');
                    }else{
                        res.send();
                    }
                });
            }else{
                res.status(500).send(err);
            }
        });
    }else{
        res.status( 403 ).send( 'not mail password demos_session' );
    }
};

exports.getUserInfo = function (req, res) {
    var userID = req.cookies[ 'demos_session' ];
    var login_session = req.cookies[ 'login_session' ];
    var pass = tool.getMd5( userID + config.MD5_SUFFIX );
    if (login_session === pass) {
        pageUser.getUserById( userID, function (err, result) {
            if( !err && result ) result.avatar = 'http://en.gravatar.com/avatar/'+ tool.getMd5( result.mail ) +'?size=100';
            err ? res.status( 500 ).send( err ) : res.send( result );
        } );
    }else{
        res.status( 403 ).send( 'not demos_session or login_session' );
    }
};

exports.retrieve = function (req, res) {
    var mail = req.body.mail;
    var password = tool.randomPassword(6, 'na');
    pageUser.retrieve(mail, password, function (err, result) {
        err ? res.status( 500 ).send( err ) : res.send();
    });
};

exports.changepw = function (req, res) {
    var userID = req.cookies[ 'demos_session' ];
    var password = req.body.password;
    pageUser.changePw(userID, password, function (err, result) {
        err ? res.status( 500 ).send( err ) : res.send();
    });
};

exports.signout = function (req, res) {
    res.clearCookie( 'login_session' );
    res.send();
};


