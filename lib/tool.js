'use strict';
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var config = require( '../config' );

exports.getMd5 = function( str ){
    if( str ){
        var md5 = crypto.createHash('md5');
        var result = md5.update( str ).digest('hex');
        return result;
    }else{
        return '';
    }
};

exports.sendMail = function (mail, html, callback) {
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
        html: html
    };
    transporter.sendMail( mailOptions, callback );
};