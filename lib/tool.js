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

exports.sendMail = function (mail, title, html, callback) {
    var transporter = nodemailer.createTransport({
        service: 'qq',
        auth: {
            user: config.MAILNAME,
            pass: config.MAILPASS
        }
    });
    var mailOptions = {
        from: 'Demos<service@demos.so>',
        to: mail,
        subject: title,
        html: html
    };
    transporter.sendMail( mailOptions, callback );
};

exports.ran = function (n, m) {
    return Math.round( Math.random() * (m-n) + n );
};

exports.randomPassword = function (length, type) {
    var obj = {
        n : '1234567890',
        a : 'abcdefghizklmnopqrstuvwsyz',
        A : 'ABCDEFGHIZKLMNOPQRSTUVWSYZ',
        s : '~!@#$%^&*()_+;,./?<>'
    };
    var arr = [];
    var pw = '';
    if( type.indexOf( 'n' ) !== -1 ) arr.push( obj.n );
    if( type.indexOf( 'a' ) !== -1 ) arr.push( obj.a );
    if( type.indexOf( 'A' ) !== -1 ) arr.push( obj.A );
    if( type.indexOf( 's' ) !== -1 ) arr.push( obj.s );
    for ( var i = 0; i < length; i++ ) {
        var j = exports.ran(0, arr.length - 1);
        var k = exports.ran(0, arr[j].length -1);
        pw += arr[j].charAt(k);
    }
    return pw;
};