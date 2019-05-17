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

	command = null;

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
				if( this.argv.length == 0 )
				{
					this.command = argv[ idxArg ];
				}
				else
				{
					this.argv.push( argv[ idxArg ] );
				}
			}
		}
	}

	public shouldLoadCache()
	{
		return !( this.command != null && this.command.indexOf( "autoload" ) != -1 )
	}

	consoleManager ()
	{
		if ( this.command == undefined )
		{
			this.openRepl();
		}
		else
		{
			this.execCommand( this.argv );
		}
	}

	execCommand ( argv: string[] )
	{
		if ( commands[ this.command ] == undefined )
		{
			throw new Error( `The command ${ this.command } doesn't exists.` );
		}
		commands[ this.command ]( argv );
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