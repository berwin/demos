/**!
 * Demos - services/code/index.js
 *
 * 代码相关的操作
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var codeModel = require(process.env.PWD + '/models/code.js');
var insertCode = require('./insert_code.js');

module.exports = {
  /*
   * 插入 code
   */
  insertCode: insertCode,

  /*
   * 获取 code
   *
   * @param {String} codeID
   * @return {String} html 或 js 代码
   */
  getCodeById: function *(id) {
    return yield codeModel.getCodeById(id);
  },

  /*
   * 通过用户ID 获取 code 列表
   *
   * @param {String} userID
   * @return {Array} code 列表
   */
  getCodesByUserID: function *(userID) {
    return yield codeModel.getCodesByUserID(id);
  },

  /*
   * 删除 code
   *
   * @param {String} codeID
   */
  rmCodeById: function *(id) {
    return yield codeModel.rmCodeById(id);
  }
};