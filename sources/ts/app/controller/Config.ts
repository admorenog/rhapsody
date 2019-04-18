import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export default class Config
{
	public static filename : string = 'config.json';
	public static encoding : string = 'utf-8';
	public static envfile : string = ".env";
	private static envVars : any;
	private static configVars : any;

	public static config( configVar? : string, configValue? : any )
	{
		Config.loadConfigVars();
		if( configValue !== undefined )
		{
			this.configVars[ configVar ] = configValue;
		}

		let configToReturn = null;
		if( configVar !== undefined )
		{
			configToReturn = this.configVars[ configVar ];
		}
		else
		{
			configToReturn = this.configVars;
		}
		return configToReturn;
	}

	public static env( envVar : string, envValue? : any )
	{
		this.loadEnvVars();
		if( envValue !== undefined )
		{
			this.envVars[ envVar ] = envValue;
		}

		let envToReturn = null;

		if( envVar !== undefined )
		{
			envToReturn = this.envVars[ envVar ];
		}
		else
		{
			envToReturn = this.envVars;
		}
		return envToReturn;
	}

	private static loadConfigVars()
	{
		if( this.configVars === undefined )
		{
			let fullname: string = app.getAppPath() + path.sep + Config.filename;
			this.configVars = JSON.parse( fs.readFileSync( fullname, Config.encoding ) );
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
}