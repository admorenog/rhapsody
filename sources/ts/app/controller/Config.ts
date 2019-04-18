import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export default class Config
{
	public debug : boolean = true;
	public static filename : string = 'config.json';
	public static encoding : string = 'utf-8';
	public static envfile : string = ".env";
	private static envVars : any;
	private static configVars : any;

	constructor( filename? : string )
	{
		Config.filename = filename || Config.filename;
		this.debug = Config.config( "debug" );
	}

	public static config( configVar : string, configValue? : any )
	{
		Config.loadConfigVars();
		if( configValue !== null )
		{
			this.envVars[ configVar ] = configValue;
		}
		return this.envVars[ configVar ];
	}

	public static env( envVar : string, envValue? : any )
	{
		this.loadEnvVars();
		if( envValue !== null )
		{
			this.envVars[ envVar ] = envValue;
		}
		return this.envVars[ envVar ];
	}

	private static loadConfigVars()
	{
		if( this.configVars === null )
		{
			let fullname: string = app.getAppPath() + path.sep + Config.filename;
			this.configVars = JSON.parse( fs.readFileSync( fullname, Config.encoding ) );
		}
	}

	private static loadEnvVars()
	{
		if( this.envVars === null )
		{
			let fullname: string = app.getAppPath() + path.sep + Config.envfile;
			let envVars = JSON.parse( fs.readFileSync( fullname, Config.encoding ) );
			this.envVars = envVars;
		}
	}
}