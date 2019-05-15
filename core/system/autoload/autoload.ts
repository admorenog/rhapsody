import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

export default class Autoload
{
	public static async getConfigFiles (): Promise<string[]>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			glob( "config/*.js", ( error: Error, matches: string[] ) =>
			{
				if ( error ) { rejects( error ); }
				resolve( matches );
			} )
		} );
	}

	public static async getModels (): Promise<string[]>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			glob( "src/models/*.ts", ( error: Error, matches: string[] ) =>
			{
				if ( error ) { rejects( error ); }
				resolve( matches );
			} )
		} );
	}

	public static async clearAutoloadFile() : Promise<any>
	{
		return new Promise( ( resolve, rejects ) => {
			fs.unlink( 'storage/cache/autoload.json', ( err ) => {
				resolve();
			} );
		});
	}

	public static async dump ()
	{
		await this.clearAutoloadFile();

		let autoloadInfo =
		{
			config : {},
			models : {}
		}
		console.log( "empieza" );
		let configFiles = await this.getConfigFiles();
		for( let idxConfigFile in configFiles )
		{
			let filename = configFiles[ idxConfigFile ];
			let indexOfExtensionSep = filename.lastIndexOf( "." );
			let indexOfFileName = filename.lastIndexOf( path.sep );
			let key = filename.substring( indexOfFileName + 1, indexOfExtensionSep );
			let configAsText = fs.readFileSync( filename ).toString();
			let config = eval( configAsText );
			autoloadInfo.config[ key ] = config;
		}
		console.log( "config files" );
		let models = await this.getModels();
		for( let idxModel in models )
		{
			let filename = models[ idxModel ];
			let indexOfExtensionSep = filename.lastIndexOf( "." );
			let indexOfFileName = filename.lastIndexOf( path.sep );
			let key = filename.substring( indexOfFileName + 1, indexOfExtensionSep );
			autoloadInfo.models[ key ] = models[ idxModel ];
		}

		fs.writeFileSync(
			'storage/cache/autoload.json',
			JSON.stringify( autoloadInfo )
		);
	}
}