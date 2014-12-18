'use strict';

var userDB = require( '../db/userDB' );
var async = require( 'async' );
var config = require( '../../config' );
var tool = require( '../tool' );


exports.register = function (mail, password, demos_session, callback) {
    async.waterfall([
        function (done) {
            userDB.getUserByMail(mail, function (err, user) {
                done(err, user);
            });
        },
        function (user, done) {
            if (!user) {
                var pass = tool.getMd5( password + config.MD5_SUFFIX );
                var data = { _id: demos_session, mail : mail, password : pass, created: new Date().getTime(), activate : false };
                userDB.insert( data, function (err, result) {
                    done(err, result);
                } );
            }else{
                done('该账户已注册');
            }
        }
    ], function (err, result) {
        callback(err, result);
    });
};

exports.activeUser = function (mail, callback) {
    userDB.updateUserByMail( mail, { activate : true }, callback );
};

exports.login = function (mail, password, callback) {
    var pass = tool.getMd5( password + config.MD5_SUFFIX );

    userDB.getUserByMail(mail, function (err, user) {
        if (!err && user) {
            if (mail === user.mail && pass == user.password){
                if( user.activate ){
                    callback(null, user);
                }else{
                    callback('您的账户未激活，请在邮件里点击按钮激活此账户');
                }
            }else{
                callback('密码不正确');
            }
        }else{
            callback( '您登陆的账户不存在' );
        }
    });
};

exports.getUserById = userDB.getUserById;
