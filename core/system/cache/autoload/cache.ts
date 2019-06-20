import * as fs from 'fs';
import * as glob from 'glob';

export default class Cache
{
	data: {} = {};

	async getDirInfo ( globpath : string ): Promise<string[]>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			try
			{
				glob( globpath, ( error: Error, matches: string[] ) =>
				{
					if ( error ) { rejects( error ); }
					resolve( matches );
				} );
			}
			catch( error )
			{
				rejects( error );
			}
		} );
	}

	async loadData() : Promise<boolean>
	{
		return new Promise( ( resolve, rejects ) => {
			rejects( "Not implemented." );
		} );
	}

	protected getClassSyntax( imports : string, properties : string, methods : string ) : string
	{
		let className = this.constructor.name;
		let classDefinition =
			`Object.defineProperty(exports, "__esModule", { value: true });\n` +
			`${ imports }\n` +
			`class ${ className } {\n` +
			`	${ properties }\n` +
			`	${ methods }\n` +
			`}\n` +
			`exports.default = ${ className };`;
		return classDefinition;
	}

	public async dump ()
	{
		await this.loadData();
		let filename = this.constructor.name.toLowerCase();
		let path = `storage/cache/${ filename }.js`;
		let imports = await this.getImports();
		let properties = await this.getProperties();
		let methods = await this.getMethods();
		let content = this.getClassSyntax( imports, properties, methods );
		await this.removeFile( path );
		fs.writeFileSync( path, content );
		console.log( `dumped file in ${ path }` );
	}

	async removeFile ( path : string ): Promise<any>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			fs.unlink( path, ( err ) =>
			{
				resolve();
			} );
		} );
	}

	getProperties (): Promise<string>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			resolve( "" );
		} );
	}

	getImports (): Promise<string>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			resolve( "" );
		} );
	}

	getMethods (): Promise<string>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			resolve( "" );
		} );
	}
}