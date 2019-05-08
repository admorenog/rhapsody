#!/usr/local/bin/node
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