/**!
 * Demos - helper/index.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var crypto = require('crypto');
var nodemailer = require('nodemailer');
var request = require('request');
var config = require('../config/index.js');

/*
 * 获取MD5
 *
 * @param {String} 任意字符串
 * @return {String} MD5之后的字符串
 */
exports.getMd5 = function (str) {
  if (!str && arguments.length === 0) return '';

  var md5 = crypto.createHash('md5');
  return md5.update(str, 'utf-8').digest('hex');
};

/*
 * 发送邮件
 *
 * @param {String} 目标邮箱地址
 * @param {String} 邮件标题
 * @param {String} 邮件内容
 * @param {Function} 回调函数
 */
exports.sendMail = function (mail, title, html) {
  var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
      user: config.mailname,
      pass: config.mailpass
    }
  });
  var mailOptions = {
    from: 'Demos<service@demos.so>',
    to: mail,
    subject: title,
    html: html
  };

  return function (done) {
    transporter.sendMail(mailOptions, done);
  }
};

/*
 * 随机数
 * 
 * @param {Number} 开始位置（包含）
 * @param {Number} 结束位置（包含）
 * @return {Number} 随机数字
 */
exports.ran = function (n, m) {
  return Math.round(Math.random() * (m-n) + n);
};

/*
 * 生成随机字符串
 * 
 * @param {Number} 字符串长度
 * @param {String} 字符串类型
 *
 * @例子
 *
 * ```
 * // 返回包含 小写字符串，大写字符串，数字，特殊字符总数为6的随机字符串
 * randomPassword(6, 'naAs'); // '1dG#h^'
 * ```
 *
 * @return {String} 随机字符串
 */
exports.randomPassword = function (length, type) {
  var obj = {
    n : '1234567890',
    a : 'abcdefghizklmnopqrstuvwsyz',
    A : 'ABCDEFGHIZKLMNOPQRSTUVWSYZ',
    s : '~!@#$%^&*()_+;,./?<>'
  };

  var arr = [];
  var pw = '';

  if (type.indexOf('n') !== -1) arr.push(obj.n);
  if (type.indexOf('a') !== -1) arr.push(obj.a);
  if (type.indexOf('A') !== -1) arr.push(obj.A);
  if (type.indexOf('s') !== -1) arr.push(obj.s);

  for (var i = 0; i < length; i++) {
    var j = exports.ran(0, arr.length - 1);
    var k = exports.ran(0, arr[j].length -1);
    pw += arr[j].charAt(k);
  }

  return pw;
};