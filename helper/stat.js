/**!
 * Demos - helper/stat.js
 *
 * 提供一些向统计系统发送各种统计请求的方法
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var request = require('request');
var config = require('../config/index.js');

/*
 * 统计代码报错
 * 执行该函数，将想 stat.berwin.me 系统发送一条请求通知demos报错了。
 */
exports.statError = function () {
  var options = {
    url: config.stat.url,
    json: true,
    method: 'POST',
    timeout: 30000,
    body: {
      groupID : config.stat.codeErrGroupID,
      sourceID : config.stat.sourceID,
      token: config.stat.token,
      data : {
        value: 'error'
      }
    }
  };
  request(options, function (e, r, body) {});
};

/*
 * 统计访问量
 * 执行该函数，将想 stat.berwin.me 系统发送一条请求通知demos报错了。
 */
exports.statUV = function (user) {
  var options = {
    url: config.stat.url,
    json: true,
    method: 'POST',
    timeout: 30000,
    body: {
      groupID : config.stat.uvGroupID,
      sourceID : config.stat.sourceID,
      token: config.stat.token,
      data : {
        user: user,
        value: 'load'
      }
    }
  };
  request(options, function (e, r, body) {});
};