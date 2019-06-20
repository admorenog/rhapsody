import * as fs from 'fs';
import * as path from 'path';
import Cache from './cache';

export default class Config extends Cache
{
	async loadData() : Promise<boolean>
	{
		return new Promise( async ( resolve, rejects ) => {
			try
			{
				let data = await super.getDirInfo( "config/*.js" );

				for ( let idx in data )
				{
					let filename = data[ idx ];
					let indexOfExtensionSep = filename.lastIndexOf( "." );
					let indexOfFileName = filename.lastIndexOf( path.sep );
					let key = filename.substring( indexOfFileName + 1, indexOfExtensionSep );
					let text = fs.readFileSync( filename ).toString();
					let value = eval( text );
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

	async getMethods (): Promise<string>
	{
		return new Promise( async ( resolve, rejects ) =>
		{
			try
			{
				let config = "{\n";
				let isFirst = true;
				for ( let cfg in this.data )
				{
					if ( !isFirst )
					{
						config += ",\n";
					}
					else
					{
						isFirst = false;
					}
					config += `			"${ cfg }" : ${ JSON.stringify( this.data[ cfg ] ) }`;
				}
				config += "\n		}";
				resolve( `static getConfig(){\n` +
					`\t	return ${ config };\n` +
					`\t}\n`);
			}
			catch ( error )
			{
				rejects();
			}
		} );
	}
}