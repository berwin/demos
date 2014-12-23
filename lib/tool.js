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
        service: 'QQ',
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

exports.random = function (n, m) {
    return parseInt( Math.max( n, Math.random() * (m+1) ) );
};

exports.randomPassword = function (length, type) {
    var PasswordCharObj = {
        n : '1234567890',
        a : 'abcdefghizklmnopqrstuvwsyz',
        A : 'ABCDEFGHIZKLMNOPQRSTUVWSYZ',
        s : '~!@#$%^&*()_+;,./?<>'
    };
    var arr = [];
    var pw = '';
    if( type.indexOf( 'n' ) !== -1 ) arr.push( PasswordCharObj.n );
    if( type.indexOf( 'a' ) !== -1 ) arr.push( PasswordCharObj.a );
    if( type.indexOf( 'A' ) !== -1 ) arr.push( PasswordCharObj.A );
    if( type.indexOf( 's' ) !== -1 ) arr.push( PasswordCharObj.s );
    for ( var i = 0; i < length; i++ ) {
        var j = exports.random(0, arr.length - 1);
        var k = exports.random(0, arr[j].length -1);
        pw += arr[j].charAt(k);
    }
    return pw;
};