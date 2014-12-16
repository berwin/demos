'use strict';
var ObjectID = require( './db/mongo' ).ObjectID;
var pageCode = require( './module/pageCode' );
var pageUser = require( './module/pageUser' );
var tool = require( './tool' );
var config = require( '../config' );
var nodemailer = require('nodemailer');

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

exports.getRegister = function (req, res) {
    res.render( 'register', { data : { _id : req.params.id } } );
};

/****************** End GET ******************/

/****************** POST ******************/

exports.postAll = function (req, res, next) {
    var passMd5 = tool.getMd5( req.body.id + config.MD5_SUFFIX );
    if( req.cookies[ passMd5 ] ){
        next();
    }else{
        res.status( 404 ).send('not cookie pass');
    }
};

exports.createCode = function (req, res) {
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

exports.postRegister = function (req, res) {
    var mail = req.body.mail;
    var password = req.body.password;
    if (mail && password) {
        
        var transporter = nodemailer.createTransport({
            service: 'QQ',
            auth: {
                user: config.MAILNAME,
                pass: config.MAILPASS
            }
        });

        var mailOptions = {
            from: 'Demos<service@demos.so>',
            to: mail,
            subject: '激活您的Demos账户',
            html: '<!doctype html><html><head><meta charset="UTF-8"><title>Demos</title><style>#mail{font:14px/200% "";background:#fff;}#mail a{display:inline-block;width:300px;height:60px;font:18px/60px "";background:#3498db;border-radius:5px;text-align:center;color:#fff;text-decoration:none;transition:.2s linear;}#mail a:hover{background:#5dade2;}#mail a:active{background:#2980B9;}</style></head><body><div id="mail"><h1>欢迎光临 Demos</h1><p>感谢您注册了Demos，体验更全面的功能。验证您的电子邮件地址，请点击下面的链接。</p><a href="#">邮箱验证</a><p>请注意，如果不激活,这个链接会在24小时内过期。</p><p>快乐的编写代码</p><p>Berwin</p></div></body></html>'
        };

        pageUser.register(mail, password, function (err, result) {
            if( result ){
                transporter.sendMail(mailOptions, function(error, info){
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
    }
};




