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
  mongo_url: 'mongodb://127.0.0.1:27017/demos',
  md5_suffix: 'Encryption',
  mailname: 'email-address',
  mailpass: 'email-password',
  hostname: 'http://www.demos.so',
  stat: {
    url: 'http://stat.berwin.me/api/v1/content',
    sourceID: '57500e23f8e333b51993ad86',
    token: '57500e23f8e333b51993ad85',
    codeErrGroupID: '57500e68f8e333b51993ad88',
    uvGroupID: '57500e55f8e333b51993ad87'
  }
};

module.exports = config;