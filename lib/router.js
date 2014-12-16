'use strict';
var express = require( 'express' );
var router = express.Router();
var controller = require( './controllers' );

router.get( '/', controller.home );
router.get( '/:id', controller.edit );
router.get( '/:id/result', controller.result );
router.get( '/:id/register', controller.getRegister );

router.post( '*', controller.postAll );
router.post( '/createCode', controller.createCode );
router.post( '/getDemosByUserID', controller.getDemosByUserID );
router.post( '/login', controller.login );
router.post( '/register', controller.postRegister );

module.exports = router;