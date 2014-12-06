'use strict';
var express = require( 'express' );
var router = express.Router();
var controller = require( './controllers' );

router.get( '/', controller.home );
router.get( '/:id', controller.edit );
router.get( '/:id/result', controller.result );

router.post( '/createCode', controller.createCode );
router.post( '/getDemosByUserID', controller.getDemosByUserID );

module.exports = router;