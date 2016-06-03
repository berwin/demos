/**!
 * Demos - route/api_route.js
 *
 * 子路由，开放API
 *
 * Authors:
 *  Berwin <liubowen.niubi@gmail.com>
 */

'use strict';

var router = require('koa-router')();
var codeCtrl = require('../controllers/api/code.js');
var userCtrl = require('../controllers/api/user.js');
var auth = require('../middleware/auth.js');

router.post('*', auth);

router
  .get('/code', codeCtrl.getCodesByUserId)
  .get('/code/:id/:type', codeCtrl.codeInfo)
  .post('/code', codeCtrl.createCode)
  .delete('/code/:id', codeCtrl.deleteCode);

router
  .post('/user', userCtrl.register)
  .get('/user', userCtrl.getUserInfo)
  .put('/user', userCtrl.changepw)
  .post('/retrieve', userCtrl.retrieve)
  .post('/login', userCtrl.login)
  .get('/signout', userCtrl.signout);

module.exports = router;