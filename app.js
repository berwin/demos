'use strict';
var express = require( 'express' );
var app = express();
var logger = require('morgan')
var router = require('./lib/router');
var config = require( './config' );
var path = require( 'path' );
var bodyParser = require('body-parser');

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
app.use( '/', router );

app.listen( config.LISTEN );