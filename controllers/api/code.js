/**!
 * Demos - controller/api/code.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var codeService = require('../../services/code/index.js');

/*
 * 返回code相关信息
 * 
 * @req-param {String} id codeID
 * @req-param {String} type {html|js}
 * @res {Object} codeInfo {code : '', userID: 'xxxxx', type: 'html'}
 */
exports.codeInfo = function *() {
  var id = this.params.id;
  var type = this.params.type;

  var code = yield *codeService.getCodeById(id);

  if (code) {
    this.body = code;
  } else {
    var userID = this.cookies.get('demos_session');
    var str = '<!doctype html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>Demos</title>\n</head>\n<body>\n    \n</body>\n</html>';
    var jsHeaderStr = '/**\n * filename: ' + id + '\n */\n';
    var obj = {code : '', userID: userID, type: type};
    if (type === 'html') obj.code = str;
    else if(type === 'js') obj.code = jsHeaderStr;
    this.body = obj;
  }
};

/*
 * 保存code
 * 创建code包括 创建新code、更新旧code，另存为新code
 *
 * - 创建新code：在数据库中创建一条新数据
 * - 更新旧code：根据codeID更新code
 * - 另存为新code：保存code的用户并不是code的创建人时，会另存一份新数据
 *
 * @return {Object} 更新后的新数据
 */
exports.saveCode = function *() {
  var userID = this.cookies.get('demos_session');

  if (!userID) {
    this.status = 403;
    this.body = 'not cookie demos_session';
  }

  var body = this.request.body;
  body.userID = userID;

  this.body = yield *codeService.insertCode(body);
};

/*
 * 获取code列表
 * 根据userID获取用户保存过的所有code
 *
 * @return {Array} code列表
 */
exports.getCodesByUserId = function *() {
  var userID = this.cookies.get('demos_session');
  this.body = yield *codeService.getCodesByUserId(userID);
};

/*
 * 通过codeID删除保存过的code数据
 */
exports.deleteCode = function *() {
  var id = this.params.id;
  var userID = this.cookies.get('demos_session');

  try {
    this.body = yield *codeService.rmCodeById(id, userID);
  } catch(e) {
    this.status = this.status = 403;
    this.body = e.message;
  }
};