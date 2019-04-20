import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import Main from '../../main/Main';

export default class Config
{
	public static configFolder : string = 'sources/config';
	public static configExtension : string = '.js';
	public static encoding : string = 'utf-8';
	public static envfile : string = ".env";
	private static envVars : any;
	private static configVars : any;

	public static config( configVar? : string, configValue? : any )
	{
		Config.loadConfigVars();
		if( configValue !== undefined )
		{
			eval( 'Config.configVars.' + configVar + ' = configValue' );
		}

		let configToReturn = null;
		if( configVar !== undefined )
		{
			configToReturn = eval( 'Config.configVars.' + configVar );
		}
		else
		{
			configToReturn = Config.configVars;
		}
		return configToReturn;
	}

	public static env( envVar : string, envValue? : any )
	{
		Config.loadEnvVars();
		if( envValue !== undefined )
		{
			Config.envVars[ envVar ] = envValue;
		}

		let envToReturn = null;

		if( envVar !== undefined )
		{
			envToReturn = Config.envVars[ envVar ];
		}
		else
		{
			envToReturn = Config.envVars;
		}
		return envToReturn;
	}

	private static loadConfigVars()
	{
		if( this.configVars === undefined )
		{
			let configFolder: string = (
				app.getAppPath() + path.sep +
				Config.configFolder + path.sep
			);
			let configFiles = fs.readdirSync( configFolder );

			this.configVars = {};
			for( let idxCfgFile = 0; idxCfgFile < configFiles.length; idxCfgFile++ )
			{
				let filePath = configFolder + path.sep + configFiles[ idxCfgFile ];

				let fileName = configFiles[ idxCfgFile ].replace(
					new RegExp( Config.configExtension, 'g' ),
					""
				);

				let configAsText = fs.readFileSync( filePath, Config.encoding );

				let configLoaded = eval( configAsText );

				Config.configVars[ fileName ] = configLoaded;
			}
		}
	}

	private static loadEnvVars()
	{
		if( this.envVars === undefined )
		{
			let fullname: string = app.getAppPath() + path.sep + Config.envfile;
			let envVars = JSON.parse( fs.readFileSync( fullname, Config.encoding ) );
			this.envVars = envVars;
		}
	}

	public static setGlobals()
	{
		global[ "env" ] = Config.env;
		global[ "config" ] = Config.config;
	}
}