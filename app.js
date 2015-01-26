'use strict';
var express = require( 'express' );
var app = express();
var logger = require('morgan');
var router = require('./lib/router');
var config = require( './config' );
var path = require( 'path' );
var bodyParser = require('body-parser');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

app.use( favicon( __dirname + '/public/images/favicon.ico' ) );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ), { maxAge: 86400000 } ) );
app.use( '/', router );

app.listen( config.LISTEN );