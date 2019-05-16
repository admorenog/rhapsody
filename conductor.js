#!/usr/local/bin/node

/**
 * This utility can be used to build our app faster with commands:
 * you can make controllers, views, models, custom commands, build
 * and other things with this utility (conductor).
 *
 * Also you can use a repl with the bootstrap of the application to
 * tinkering or debugging your application.
 *
 * Please, do not modify this file, this is part of the kernel and it
 * should works modifiying the src folder of your application.
 */

"use strict";

const kernel = require( "./app/core/kernel" ).default;
const Console = require( "./app/core/system/console/Console" ).default;

/**
 * We need to bootstrap the same app, but instead calling the electron window
 * manager we going to call our console manager.
 */

let argv = process.argv;

let canLoadCache = true;

if( argv.length > 2 && argv[ 2 ] == "dump-autoload" )
{
	canLoadCache = false;
}
kernel.bootstrap( canLoadCache );

var console = new Console( argv );
console.consoleManager();
/*
var builder = require( 'electron-builder' );

// ... Some logic that builds up the build field, e.g.:
let options = {
	"mac": {
		"target": [
			{
				"target": "default"
			}
		]
	},
	"extraFiles" : [
		".env"
	]
}

builder.build( options ).then( ( sth ) =>
{
	// I have literally no idea what would be passed
	// during a successful call, maybe just dump it
	// to the console
	console.log( sth )
} ).catch( ( e ) =>
{
	// Some error handling
	console.error( e )
} );
*/