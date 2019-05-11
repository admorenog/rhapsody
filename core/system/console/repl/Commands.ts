import Command from './Command';

import ExitCommand from './commands/ExitCommand';
import HelpCommand from './commands/HelpCommand';
import SaveCommand from './commands/SaveCommand';
import LoadCommand from './commands/LoadCommand';
import EditCommand from './commands/EditCommand';

export default class Commands
{
	static commands: typeof Command[] = [ ];

	static register (): void
	{
		/**
		 * We need to register manually because dynamically could
		 * give us problems when is compiled (giving to the final
		 * user the possibility to read our commands easily).
		 */
		Commands.commands.push( ExitCommand );
		Commands.commands.push( HelpCommand );
		Commands.commands.push( SaveCommand );
		Commands.commands.push( LoadCommand );
		Commands.commands.push( EditCommand );
	}

	static execute ( sentence: string ): boolean
	{
		let command = Commands.getCommand( sentence );
		let args = Commands.getArguments( sentence );

		return command.fn( args );
	}

	static getCommand ( sentence: string ): typeof Command
	{
		let cmd = sentence.split( " " )[ 0 ];

		let command = Command;

		command.cmd = cmd;

		for ( let idxCommand in this.commands )
		{
			if ( cmd == this.commands[ idxCommand ].cmd )
			{
				command = this.commands[ idxCommand ];
			}
		}

		return command;
	}

	static getArguments ( sentence: string ): string[]
	{
		let args = sentence.split( " " );

		args.shift();

		return args;
	}
	/**
	 * The console requires a boolean to know if should close the repl
	 * so all command must return true but exit.
	 *
	 * The help command will show the commands and their description.
	 *
	 * The load command will eval the script (the modules should be imported by the user)
	 *
	 * save will get the history commands and save it on a file. If a command throw an
	 * Error we going to write a comment with the description of the Error.
	 *
	 * edit going to create a temp file and will try to execute the application with the
	 * tmp file as a param. We need to attach fs listeners (fswatch) to check when is saved
	 * to read the content and execute it. When the child_process is closed we will show
	 * a message in the repl.
	 */
}