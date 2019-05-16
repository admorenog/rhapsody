import * as readline from 'readline';
import Commands from './repl/Commands';
import Autoload from '../autoload/autoload';

/**
 * Command line utilitie to make the develop
 * easier
 */
export default class Console
{
	nodePath: string;
	conductorPath: string;

	argv: string[] = [];

	constructor ( argv: string[] )
	{
		this.setArgs( argv );
	}

	setArgs ( argv: string[] ): void
	{
		for ( let idxArg in argv )
		{
			if ( argv[ idxArg ].indexOf( "node" ) != -1 )
			{
				this.nodePath = argv[ idxArg ];
			}
			else if ( argv[ idxArg ].indexOf( "conductor" ) != -1 )
			{
				this.conductorPath = argv[ idxArg ];
			}
			else
			{
				this.argv.push( argv[ idxArg ] );
			}
		}
	}

	consoleManager ()
	{
		if ( this.argv.length == 0 )
		{
			this.openRepl();
		}
		else
		{
			this.findCommand( this.argv );
		}
	}

	findCommand ( argv: string[] )
	{
		//TODO: here we need to find a command by the first arg
		if ( argv[ 0 ] == "dump-autoload" )
		{
			Autoload.dump();
		}
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
				var keepOpen = Console.processCliResponse( response );
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
		if ( Console.isCommand( response ) )
		{
			return Commands.execute( response );
		}
		else
		{
			try
			{
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