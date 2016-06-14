/**!
 * Demos - controller/api/code.js
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var codeService = require('../../services/code/index.js');

exports.codeInfo = function *() {
  var id = this.params.id;
  var type = this.params.type;

  var code = yield *codeService.getCodeById(id);

  if (code) {
    this.body = code;
  } else {
    var userID = this.cookies.get('demos_session');
    var str = '<!doctype html>\n<html>\n<head>\n    <meta charset="UTF-8">\n    <title>Demos</title>\n</head>\n<body>\n    \n</body>\n</html>';
    var obj = {code : '', userID: userID, type: type};
    if (type === 'html') obj.code = str;
    this.body = obj;
  }
};

exports.createCode = function *() {
  var userID = this.cookies.get('demos_session');

  if (!userID) {
    this.status = 403;
    this.body = 'not cookie demos_session';
  }

  var body = this.request.body;
  body.userID = userID;

  this.body = yield *codeService.insertCode(body);
};

exports.getCodesByUserId = function *() {
  var userID = this.cookies.get('demos_session');
  this.body = yield *codeService.getCodesByUserId(userID);
};

exports.deleteCode = function *() {
  var id = this.params.id;
  this.body = yield *codeService.rmCodeById(id);
};