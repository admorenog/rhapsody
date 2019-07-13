import * as path from 'path';
import Cache from './cache';

export default class Commands extends Cache
{
	async loadData() : Promise<boolean>
	{
		return new Promise( async ( resolve, rejects ) => {
			try
			{
				let data = await super.getDirInfo( "core/system/console/Commands/*.ts" );

				for ( let idxCmd in data )
				{
					let filename = data[ idxCmd ];
					let indexOfExtensionSep = filename.lastIndexOf( "." );
					let indexOfFileName = filename.lastIndexOf( path.sep );
					filename = filename.substring( 0, indexOfExtensionSep );
					let key = require( "../../../../" + filename ).default.signature;
					filename = filename.substring( indexOfFileName + 1 );
					this.data[ key ] = filename;
				}
				resolve();
			}
			catch ( error )
			{
				rejects( error );
			}
		} );
	}

	async getImports (): Promise<string>
	{
		return new Promise( ( resolve, rejects ) => {
			try
			{
				let imports = "";
				let importPath = "../../app/core/system/console/Commands/";
				for ( let cmd in this.data )
				{
					imports += `const ${ this.data[ cmd ] } = require("${ importPath }${ this.data[ cmd ] }");\n`;
				}
				resolve( imports );
			}
			catch( error )
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
				let cmds = "{\n";
				let isFirst = true;
				for ( let cmd in this.data )
				{
					if ( !isFirst )
					{
						cmds += ",\n";
					}
					else
					{
						isFirst = false;
					}
					cmds += `			"${ cmd }" : ${ this.data[ cmd ] }.default.run`;
				}
				cmds += "\n		}";
				resolve( `static getCommands(){\n` +
					`\t	return ${ cmds };\n` +
					`\t}\n`);
			}
			catch ( error )
			{
				rejects();
			}
		} );
	}
}