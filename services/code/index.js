/**!
 * Demos - services/code/index.js
 *
 * 代码相关的操作
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var codeModel = require('../../models/code.js');
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
  getCodesByUserId: function *(userID) {
    return yield codeModel.getCodesByUserId(userID);
  },

  /*
   * 修改 code
   *
   * @param {String} codeID
   * @return {Object} 更新后的数据
   */
  updateCodeById: function *(id, data) {
    return yield codeModel.updateCodeById(id, data);
  },

  /*
   * 删除 code
   *
   * @param {String} codeID
   */
  rmCodeById: function *(id, userID) {
    var codeInfo = yield codeModel.getCodeById(id);
    
    if (codeInfo.userID === userID) {
      return yield codeModel.rmCodeById(id);
    } else {
      throw new Error('The user doesn`t have permission to delete the code');
    }
  }
};