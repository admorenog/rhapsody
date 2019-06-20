import * as path from 'path';
import Cache from './cache';

export default class Models extends Cache
{
	async loadData() : Promise<boolean>
	{
		return new Promise( async ( resolve, rejects ) => {
			try
			{
				let data = await super.getDirInfo( "src/models/*.ts" );

				for ( let idxModel in data )
				{
					let filename = data[ idxModel ];
					let indexOfExtensionSep = filename.lastIndexOf( "." );
					let indexOfFileName = filename.lastIndexOf( path.sep );
					let key = filename.substring( indexOfFileName + 1, indexOfExtensionSep );
					this.data[ key ] = filename.substring( 0, indexOfExtensionSep );
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
				for ( let model in this.data )
				{
					imports += `const ${ model } = require("../../app/${ this.data[ model ] }");\n`;
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
				let models = "{\n";
				let isFirst = true;
				for ( let model in this.data )
				{
					if ( !isFirst )
					{
						models += ",\n";
					}
					else
					{
						isFirst = false;
					}
					models += `			"${ model }" : ${ model }.default`;
				}
				models += "\n		}";
				resolve(
					`static getModels(){\n` +
					`\t	return ${ models };\n` +
					`\t}\n`
				);
			}
			catch ( error )
			{
				rejects();
			}
		} );
	}
}