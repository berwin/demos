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
    groupID: '55ab38d919a9a46b48bef001',
    sourceID: '558a2ef3459c3d595db03329',
    token: '558a2ef3459c3d595db03328'
  }
};

module.exports = config;