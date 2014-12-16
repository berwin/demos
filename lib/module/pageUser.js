'use strict';

var userDB = require( '../db/userDB' );
var async = require( 'async' );
var config = require( '../../config' );
var tool = require( '../tool' );


exports.register = function (mail, password, callback) {
    async.waterfall([
        function (done) {
            userDB.getUserByMail(mail, function (err, list) {
                done(err, list);
            });
        },
        function (list, done) {
            if (!list.length) {
                var pass = tool.getMd5( password + config.MD5_SUFFIX );
                var data = { mail : mail, password : pass, created: new Date().getTime(), activate : false };
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