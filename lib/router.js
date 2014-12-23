'use strict';
var express = require( 'express' );
var router = express.Router();
var controller = require( './controllers' );

router.get( '/', controller.home );
router.get( '/:id', controller.edit );
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

module.exports = router;