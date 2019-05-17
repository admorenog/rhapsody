import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

export default class Autoload
{
	static models: {} = {};
	static envVars: {} = {};
	static config: {} = {};
	static cmds: {} = {};
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

	public static async getCommands (): Promise<string[]>
	{
		return new Promise( ( resolve, rejects ) =>
		{
			glob( "core/system/console/Commands/*.ts", ( error: Error, matches: string[] ) =>
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
		await Autoload.clearAutoloadFile();

		Autoload.envVars = JSON.parse( Autoload.getEnv() );

		global[ "env" ] = Autoload.env;

		let configFiles = await Autoload.getConfigFiles();
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

		let models = await Autoload.getModels();
		for ( let idxModel in models )
		{
			let filename = models[ idxModel ];
			let indexOfExtensionSep = filename.lastIndexOf( "." );
			let indexOfFileName = filename.lastIndexOf( path.sep );
			let key = filename.substring( indexOfFileName + 1, indexOfExtensionSep );
			Autoload.models[ key ] = filename.substring( 0, indexOfExtensionSep );
		}

		let cmds = await Autoload.getCommands();
		for ( let idxCmd in cmds )
		{
			let filename = cmds[ idxCmd ];
			let indexOfExtensionSep = filename.lastIndexOf( "." );
			let indexOfFileName = filename.lastIndexOf( path.sep );
			filename = filename.substring( 0, indexOfExtensionSep );
			let key = require( "../../../" + filename ).default.signature;
			filename = filename.substring( indexOfFileName + 1 );
			Autoload.cmds[ key ] = filename;
			console.log( key, filename.substring( 0, indexOfExtensionSep ) );
		}

		let autoloadPath = 'storage/cache/autoload.js';
		let autoloadContent = Autoload.getFileSyntax();
		fs.writeFileSync(
			autoloadPath,
			autoloadContent
		);

		console.log( `dumped autoload file in ${ autoloadPath }` );
	}

	static getFileSyntax (): string
	{
		let modelImports = Autoload.getModelImports();
		let cmdImports = Autoload.getCommandsImports();
		let models = Autoload.getModelsFn();
		let env = Autoload.getEnvFn();
		let config = Autoload.getConfigFn();
		let commands = Autoload.getCommandsFn();
		let classDefinition =
			`Object.defineProperty(exports, "__esModule", { value: true });\n` +
			`${ modelImports }\n` +
			`${ cmdImports }\n` +
			`class Autoload {\n` +
			`	${ models }\n` +
			`	${ env }\n` +
			`	${ config }\n` +
			`	${ commands }\n` +
			`}\n` +
			`exports.default = Autoload;`;
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
	static getCommandsImports (): string
	{
		let imports = "";
		let importPath = "../../app/core/system/console/Commands/";
		for ( let cmd in Autoload.cmds )
		{
			imports += `const ${ Autoload.cmds[ cmd ] } = require("${ importPath }${ Autoload.cmds[ cmd ] }");\n`;
		}
		return imports;
	}

	static getCommandsFn (): string
	{
		let cmds = "{\n";
		let isFirst = true;
		for ( let cmd in Autoload.cmds )
		{
			if ( !isFirst )
			{
				cmds += ",\n";
			}
			else
			{
				isFirst = false;
			}
			cmds += `			"${ cmd }" : ${ Autoload.cmds[ cmd ] }.default`;
		}
		cmds += "\n		}";
		return `static getCommands(){\n` +
			`\t	return ${ cmds };\n` +
			`\t}\n`;
	}

	static getEnvFn (): string
	{
		let env = JSON.stringify( Autoload.envVars );
		return `static getEnv(){\n` +
			`\t	return ${ env };\n` +
			`\t}\n`;
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