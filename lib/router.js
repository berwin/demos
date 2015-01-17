'use strict';
var express = require( 'express' );
var router = express.Router();
var controller = require( './controllers' );

router.get( '/', controller.home );
router.get( '/html', controller.redirectHtml );
router.get( '/js', controller.redirectJs );
router.get( '/html/:id', controller.setSession, controller.edit );
router.get( '/js/:id', controller.setSession ,controller.editJS );
router.get( '/:id/result', controller.result );
router.get( '/activate/:mail/:md5', controller.activate );

router.post( '*', controller.postAll );
router.post( '/createCode', controller.createCode );
router.post( '/getDemosByUserID', controller.getDemosByUserID );
router.post( '/login', controller.login );
router.post( '/register', controller.postRegister );
router.post( '/getUserInfo', controller.getUserInfo );
router.post( '/retrieve', controller.retrieve );
router.post( '/changepw', controller.changepw );
router.post( '/signout', controller.signout );
router.post( '/rmCode/:id', controller.rmCode )

module.exports = router;