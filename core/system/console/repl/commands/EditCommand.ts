import Command from '../Command';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';
import Console from '../../Console';

export default class EditCommand extends Command
{
	static repl = true;
	static conductor = false;
	static cmd = ".edit";
	static desc = "Open an external editor and load the script on save.";
	static fn = ( args ) =>
	{
		let randomTempNameOfFile = "script_" + ( new Date() ).toString() + ".js";
		let tmpfile = os.tmpdir() + path.sep + randomTempNameOfFile;
		fs.writeFileSync( tmpfile, EditCommand.getInitialComment() );

		fs.watchFile( tmpfile, ( curr: fs.Stats, prev: fs.Stats ) =>
		{
			console.log( "executing file code" );
			Console.processCliResponse( fs.readFileSync( tmpfile ).toString() );
		} );

		/**
		 * FIXME: use asyc exec to watch the close file to finish this process.
		 */
		let editor = child_process.exec( "code -n -w " + tmpfile,
			( error: child_process.ExecException, stdout: string, stderr: string ) =>
			{
				if ( error != null && error.killed )
				{
					console.log( "stop watching temp file ", error );
					fs.unwatchFile( tmpfile );
					fs.unlinkSync( tmpfile );
					return true;
				}
			} );

		let process_id = editor.pid;

		process.on( "beforeExit", ( code: number ) =>
		{
			fs.unwatchFile( tmpfile );
			fs.unlinkSync( tmpfile );
			process.kill( process_id, 9 );
		} );

		return true;
	}

	static getInitialComment (): string
	{
		let comment = "";
		comment += "/**\n";
		comment += " * Here you can write your code and every time you save it\n";
		comment += " * it will be executed in the repl.\n";
		comment += " */\n";
		return comment;
	}
}