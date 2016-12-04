/**!
 * Demos - middleware/set_session.js
 *
 * 设置session和cookie
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var helper = require('../helper/index.js');
var config = require('../config/index.js');
var stat = require('../helper/stat.js');
var ObjectID = require('../models/base.js').ObjectID;

/*
 * 为了防止恶意写入垃圾代码，做的一个策略
 * 1. 用codeID+md5_suffix 生成一个秘钥，设置到cookie中
 * 2. 保存代码的时候，验证这个秘钥是否正确
 * 事实证明，通过这种方式，成功了阻止了之前有人用脚本恶意往数据中插入大量垃圾数据的问题
 */
module.exports = function *(next) {
  var passMd5 = helper.getMd5(this.params.id + config.md5_suffix);

  // 如果是第一次访问，设置一个秘钥
  if (!this.cookies.get(passMd5)) {
    this.cookies.set(passMd5, 1, { httpOnly: true });
  }

  // 给未注册的用户，设置一个userID（不注册也会有一个用户ID，用来查询这个匿名用户保存过哪些code）
  var userID = ObjectID().toString();
  if (!this.cookies.get('demos_session')) {
    // 过期时间一个月，并且web端不可访问cookie值
    this.cookies.set('demos_session', userID, {expires: new Date(Date.now() + 86400000*30), httpOnly: true});
  }

  // 为了配合前端，单独设置一个前端可以访问的cookie，让前端访问userID
  if (!this.cookies.get('userID')) {
    this.cookies.set('userID', userID, {expires: new Date(Date.now() + 86400000*30), httpOnly: false});
  }

  // 统计访问量
  stat.statUV(this.cookies.get('demos_session') || '新用户（首次访问用户）');

  yield *next;
};