/// <reference path="../../../system/helpers/Globals.d.ts" />

import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

export default class MakeModel
{
	public static signature = "make:model";

	static run( argv )
	{
		if( argv[ 0 ] == null )
		{
			// Dump error prettier
			throw new Error( tr( "conductor.errors.command.model.arg_required") );
		}
		let filename = 'src/models/' + argv[0] + '.ts';
		if( fs.existsSync( filename ) )
		{
			throw new Error( `The file ${ filename } already exists.` );
		}

		fs.writeFileSync( filename, '' );
		console.log( `Created model ${ filename }` );

		child_process.execSync( `${ process.cwd() + path.sep }conductor.js dump-autoload` );

		console.log( `Dumped autoload` );
	}
}