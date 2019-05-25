import * as readline from 'readline';
import Commands from './Commands';

export default class Repl
{
	constructor ()
	{
	}

	openRepl ()
	{
		this.showStartMessage();
		let rl = readline.createInterface( {
			input: process.stdin,
			output: process.stdout
		} );

		this.consoleLoop( rl );
	}

	showStartMessage ()
	{
		console.log( "Welcome to the conductor of Rhapsody, a Rhapsody repl." );
		console.log( "For more information use .help command." );
	}

	async consoleLoop ( rl : readline.Interface )
	{
		var keepOpen: boolean = true;
		while ( keepOpen )
		{
			await this.processCli( rl )
				.catch( () =>
				{
					keepOpen = false;
					rl.close();
					process.exit( 0 );
				} );
		}
	}

	processCli ( rl: readline.Interface ): Promise<object>
	{
		return new Promise( ( resolve, reject ) =>
		{
			rl.question( '>>> ', ( response ) =>
			{
				var keepOpen = Repl.processCliResponse( response );
				if ( keepOpen )
				{
					resolve();
				}
				else
				{
					reject();
				}
			} );
		} );
	}

	public static processCliResponse ( response: string ): boolean
	{
		if ( Repl.isCommand( response ) )
		{
			return Commands.execute( response );
		}
		else
		{
			try
			{
				// console.log(util.inspect(response, { compact: true, depth: 5, breakLength: 80 }));
				console.log( "<<<", eval.apply( this, [ response ] ) );
			}
			catch ( error )
			{
				console.error( error.message );
			}
			return true;
		}
	}

	static isCommand ( command: string )
	{
		return ( command.charAt( 0 ) == "." );
	}
}