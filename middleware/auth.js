/**!
 * Demos - middleware/auth.js
 *
 * 认证用户是否是合法用户（合法用户是人，而不是机器之类的脚本）
 * 主要为了防止有人用脚本恶意往数据库中插入垃圾代码
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var helper = require('../helper/index.js');
var config = require('../config/index.js');

module.exports = function *(next) {
  var passMd5 = helper.getMd5(this.request.body.id + config.md5_suffix);

  if (this.cookies.get(passMd5)) {
    yield *next;
  } else {
    this.status = 403;
    this.body = 'Unable to pass authentication';
  }
};