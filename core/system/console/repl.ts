import * as readline from 'readline';

/**
 * Read, eval, print and loop
 */
export default class Repl
{

	consoleManager ()
	{
		let rl = readline.createInterface( {
			input: process.stdin,
			output: process.stdout
		} );

		this.consoleLoop( rl );
	}

	async consoleLoop( rl )
	{
		var keepOpen : boolean = true;
		while( keepOpen )
		{
			await this.processCli( rl )
				.catch( ()=>{
					keepOpen = false;
					rl.close();
				} );
		}
	}

	processCli ( rl: readline.Interface ) : Promise<object>
	{
		return new Promise( ( resolve, reject ) =>
		{
			rl.question( '>>> ', ( response ) =>
			{
				var keepOpen = this.processCliResponse( response );
				if( keepOpen )
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

	processCliResponse ( response: string ): boolean
	{
		if ( response == "quit" || response == "exit" )
		{
			console.log( "Bye!" );
			return false;
		}
		else
		{
			try
			{
				console.log( eval.apply( this, [ response ] ) );
			}
			catch ( error )
			{
				console.error( error.message );
			}
			return true;
		}
	}
}