/**!
 * Demos - services/code/insert_code.js
 *
 * 插入 code 操作
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var codeModel = require('../../models/code.js');
var ObjectID = require('../../models/base.js').ObjectID;

/*
 * 保存代码
 * 保存代码分3个类型，1. 创建代码 2. 修改代码 3. 另存为新代码
 *
 * @param {Object} 数据
 * @return {Object} {status: x, data: data}
 * @return {Object.status} 状态码，表示插入类型，类型有3种，
 * 0 -> 创建新代码
 * 1 -> 更新代码
 * 2 -> 另存为新代码
 * @return {Object.data} code信息
 */
module.exports = function *(data) {

  if (!data.id || !data.code || !data.type) {
    throw new Error('Incorrect parameter');
  }

  var codeInfo = yield codeModel.getCodeById(data.id);
  var time = new Date().getTime();

  if (data.type === 'js') {
    // 截取第一个注释中filename之后的字符串为文件名
    var alias = String(data.code).match(/\*\s+filename:\s+(.*)/im)[1];
    if (alias) alias = alias.trim();
  }

  /*
   * 创建代码
   */
  if (codeInfo === null) {
    var result = yield codeModel.insertCode({_id: data.id, alias: alias, code: data.code, type: data.type, userID: data.userID, firstTime: time, lastTime: time});
    return {status: 0, data: result.ops[0]};
  }

  /*
   * 修改代码
   */
  if (codeInfo.userID === data.userID) {
    var result = yield codeModel.updateCodeById(data.id, {code: data.code, lastTime: time, alias: alias});
    var ret = {status: 1, data: result.value};
    if (codeInfo.alias !== alias) ret.nrm = true; // nrm: need reload menu
    return ret;
  }

  /*
   * 另存为新代码（表示A创建的code之后，把地址发给了B，B对code进行修改点击保存的时候，不允许修改A的代码，而是另存了一份）
   */
  if (codeInfo.userID !== data.userID) {
    var result = yield codeModel.insertCode({_id: ObjectID().toString(), alias: alias, code: data.code, type: data.type, userID: data.userID, firstTime: time, lastTime: time});
    return {status: 2, data: result.ops[0]};
  }
};