#!/usr/local/bin/node

"use strict";
const kernel = require( "./app/core/kernel" ).default;
const repl = require( "./app/core/system/console/repl" ).default;

/**
 * We need to bootstrap the same app, but instead calling the electron window
 * manager we going to call our console manager.
 */

kernel.bootstrap();

let args = null;
let argc = 0;

var console = new repl();
console.consoleManager( args, argc );

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