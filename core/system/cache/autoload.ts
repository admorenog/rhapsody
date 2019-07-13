import * as fs from 'fs';
import Commands from './autoload/commands';
import Config from './autoload/config';
import Models from './autoload/models';
import Translations from './autoload/translations';

export default class Autoload
{
	static envVars: {} = {};

	public static getEnv (): string
	{
		return fs.readFileSync( '.env' ).toString();
	}

	public static async clearAutoloadFile (): Promise<any>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			fs.unlink( 'storage/cache/autoload.js', ( err ) =>
			{
				resolve();
			} );
		} );
	}

	public static async dump ()
	{
		await Autoload.clearAutoloadFile();

		Autoload.envVars = JSON.parse( Autoload.getEnv() );

		global[ "env" ] = Autoload.env;

		let cfg = new Config;
		await cfg.dump();

		let mod = new Models;
		await mod.dump();

		let comm = new Commands;
		await comm.dump();

		let translations = new Translations;
		await translations.dump();
	}

	public static env ( envVar: string, envValue?: any )
	{
		if ( envValue !== undefined )
		{
			Autoload.envVars[ envVar ] = envValue;
		}

		let envToReturn = null;

		if ( envVar !== undefined )
		{
			envToReturn = Autoload.envVars[ envVar ];
		}
		else
		{
			envToReturn = Autoload.envVars;
		}
		return envToReturn;
	}
}