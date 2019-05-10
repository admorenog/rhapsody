/// <reference path="./system/Globals.d.ts" />

import { app } from 'electron';
import * as readline from 'readline';
import WindowRenderers from './system/views/windows/WindowRenderers';
import Config from './components/Config';
import Systray from './components/Systray';
import Menu from './components/Menu';
import Router from './system/routes/Router';
import Controller from './system/controllers/Controller';
import Renderer from './system/views/Render';


export default class Kernel
{
	static windows: WindowRenderers;
	static menu: Menu;
	static systray: Systray;
	static render: Renderer;

	private static onWindowAllClosed (): void
	{
		if ( process.platform !== 'darwin' || !Config.config( "debug" ) )
		{
			app.quit();
		}
	}

	private static onReady (): void
	{
		let views = config( "app" )[ "start_views" ];

		for ( let idxView in views )
		{
			Router.route( views[ idxView ] );
		}

		Kernel.systray = new Systray( config( "systray" ) );
	}

	private static onActivate (): void
	{
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if ( Kernel === null )
		{
			Kernel.onReady();
		}
	}

	private static initMenu ()
	{
		let menu = new Menu();
		return menu;
	}

	private static getContext ()
	{
		return {
			config: config()
		}
	}

	private static setGlobals ()
	{
		global[ "kernel" ] = this;
		global[ "app" ] = app;
		global[ "view" ] = Controller.view;
		Config.setGlobals();
	}

	static windowManager ()
	{
		Kernel.menu = Kernel.initMenu();
		Kernel.windows = new WindowRenderers();
		app.on( 'window-all-closed', Kernel.onWindowAllClosed );
		app.on( 'ready', Kernel.onReady );
		app.on( 'activate', Kernel.onActivate );
	}

	static consoleManager ()
	{
		let rl = readline.createInterface( {
			input: process.stdin,
			output: process.stdout
		} );

		Kernel.consoleLoop( rl );
	}

	static async consoleLoop( rl )
	{
		var keepOpen : boolean = true;
		while( keepOpen )
		{
			await Kernel.processCli( rl )
				.catch( ()=>{
					keepOpen = false;
					rl.close();
				} );
		}
	}

	static processCli ( rl: readline.Interface ) : Promise<object>
	{
		return new Promise( ( resolve, reject ) =>
		{
			rl.question( '>>> ', ( response ) =>
			{
				var keepOpen = Kernel.processCliResponse( response );
				if( keepOpen )
				{
					resolve();
				}
				else
				{
					reject();
				}
			} );
		} );
	}

	static processCliResponse ( response: string ): boolean
	{
		if ( response == "quit" || response == "exit" )
		{
			console.log( "Bye!" );
			return false;
		}
		else
		{
			try
			{
				console.log( eval.apply( this, [ response ] ) );
			}
			catch ( error )
			{
				console.error( error.message );
			}
			return true;
		}
	}

	static bootstrap ()
	{
		Kernel.setGlobals();
	}

}