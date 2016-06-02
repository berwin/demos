/**!
 * Demos - config/index.js
 *
 * 项目配置文件
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */


'use strict';

var config = {
  port: 1995,
  MONGO_RUL : 'mongodb://127.0.0.1:27017/demos',
  MD5_SUFFIX : 'Encryption',
  MAILNAME : 'email-address',
  MAILPASS : 'email-password',
  HOSTNAME: 'http://www.demos.so'
};

module.exports = config;