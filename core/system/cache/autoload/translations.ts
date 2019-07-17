import * as fs from 'fs';
import * as path from 'path';
import Cache from './cache';

export default class Translations extends Cache
{
	async loadData() : Promise<boolean>
	{
		return new Promise( async ( resolve, rejects ) => {
			try
			{
				let data = await super.getDirInfo( "res/lang/*.js" );

				for ( let idx in data )
				{
					let filename = data[ idx ];
					let indexOfExtensionSep = filename.lastIndexOf( "." );
					let indexOfFileName = filename.lastIndexOf( path.sep );
					let key = filename.substring( indexOfFileName + 1, indexOfExtensionSep );
					let text = fs.readFileSync( filename ).toString();
					let value = text;
					this.data[ key ] = value;
				}
				resolve();
			}
			catch ( error )
			{
				rejects( error );
			}
		} );
	}

	async getProperties (): Promise<string>
	{
		return new Promise( async ( resolve, rejects ) =>
		{
			try
			{
				let className = this.constructor.name;
				let methods = "";
				for ( let key in this.data )
				{
					methods += `${ className }.${ key } = ${ this.data[ key ] };\n`;
				}
				methods += "\n";
				resolve( methods );
			}
			catch ( error )
			{
				rejects();
			}
		} );
	}
}