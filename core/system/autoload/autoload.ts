import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

export default class Autoload
{
	static models: {} = {};
	static envVars: {} = {};
	static config: {} = {};
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

	public static getEnv (): string
	{
		return fs.readFileSync( '.env' ).toString();
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
		await this.clearAutoloadFile();

		Autoload.envVars = JSON.parse( Autoload.getEnv() );

		global[ "env" ] = this.env;

		let configFiles = await this.getConfigFiles();
		for ( let idxConfigFile in configFiles )
		{
			let filename = configFiles[ idxConfigFile ];
			let indexOfExtensionSep = filename.lastIndexOf( "." );
			let indexOfFileName = filename.lastIndexOf( path.sep );
			let key = filename.substring( indexOfFileName + 1, indexOfExtensionSep );
			let configAsText = fs.readFileSync( filename ).toString();
			let config = eval( configAsText );
			Autoload.config[ key ] = config;
		}

		let models = await this.getModels();
		for ( let idxModel in models )
		{
			let filename = models[ idxModel ];
			let indexOfExtensionSep = filename.lastIndexOf( "." );
			let indexOfFileName = filename.lastIndexOf( path.sep );
			let key = filename.substring( indexOfFileName + 1, indexOfExtensionSep );
			Autoload.models[ key ] = filename.substring( 0, indexOfExtensionSep );
		}

		let autoloadContent = this.getFileSyntax();
		fs.writeFileSync(
			'storage/cache/autoload.js',
			autoloadContent
		);
	}

	static getFileSyntax (): string
	{
		let models = Autoload.getModelsFn();
		let env = Autoload.getEnvFn();
		let config = Autoload.getConfigFn();
		let modelImports = Autoload.getModelImports();
		let classDefinition =
			`Object.defineProperty(exports, "__esModule", { value: true });\n` +
			`${ modelImports }\n` +
			`class Autoload {\n` +
			`	${ models }\n` +
			`	${ env }\n` +
			`	${ config }\n` +
			`}\n` +
			`exports.default = Autoload;`;
		console.log( classDefinition );
		return classDefinition;
	}

	static getModelImports (): string
	{
		let imports = "";
		for ( let model in Autoload.models )
		{
			imports += `const ${ model } = require("../../app/${ Autoload.models[ model ] }");\n`;
		}
		return imports;
	}

	static getModelsFn (): string
	{
		let models = "{\n";
		let isFirst = true;
		for ( let model in Autoload.models )
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
		return `static getModels(){\n` +
			`\t	return ${ models };\n` +
			`\t}\n`;
	}

	static getConfigFn (): string
	{
		let config = "{\n";
		let isFirst = true;
		for ( let cfg in Autoload.config )
		{
			if ( !isFirst )
			{
				config += ",\n";
			}
			else
			{
				isFirst = false;
			}
			config += `			"${ cfg }" : ${ JSON.stringify( Autoload.config[ cfg ] ) }`;
		}
		config += "\n		}";
		return `static getConfig(){\n` +
			`\t	return ${ config };\n` +
			`\t}\n`;
	}

	static getEnvFn (): string
	{
		let env = JSON.stringify( Autoload.envVars );
		return `static getEnv(){\n` +
			`\t	return ${ env };\n` +
			`\t}\n`;
	}


	public static env( envVar : string, envValue? : any )
	{
		if( envValue !== undefined )
		{
			Autoload.envVars[ envVar ] = envValue;
		}

		let envToReturn = null;

		if( envVar !== undefined )
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