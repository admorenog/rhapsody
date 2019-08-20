/// <reference path="./system/helpers/Globals.d.ts" />

import { app } from 'electron';
import WindowRenderers from './system/views/windows/WindowRenderers';
import Config from './components/Config';
import Systray from './components/Systray';
import Menu from './components/Menu';
import Router from './system/routes/Router';
import Controller from './system/controllers/Controller';
import Renderer from './system/views/Render';
import Commands from './system/console/repl/Commands';
import Autoload from './system/cache/autoload';
import Translator from './system/translator/translator';

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
		Router.setupRouteProtocol();

		let views = config[ "app" ][ "start_views" ];

		for ( let idxView in views )
		{
			Router.route( views[ idxView ] );
		}

		Kernel.systray = new Systray( config[ "systray" ] );
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

	private static setGlobals ( canLoadCache: boolean = true )
	{
		global[ "kernel" ] = this;
		global[ "app" ] = app;
		global[ "view" ] = Controller.view;
		global[ "conductor" ] = Commands;
		global[ "commands" ] = { "dump-autoload": Autoload.dump };
		/**
		 * We need to ignore the autoload file only when we executing the
		 * command `conductor dump-autoload` and to avoid typescript errors
		 * we need to call it dynamically with a require.
		 */
		if ( canLoadCache )
		{
			global[ "tr" ] = Translator.translate;
			const models = require( '../../tmp/models' ).default;
			const config = require( '../../tmp/config' ).default;
			const commands = require( '../../tmp/commands' ).default;
			global[ "models" ] = models.getModels();
			global[ "config" ] = config.getConfig();
			global[ "commands" ] = commands.getCommands();
		}
	}

	static windowManager ()
	{
		Kernel.menu = Kernel.initMenu();
		Kernel.windows = new WindowRenderers();
		app.on( 'window-all-closed', Kernel.onWindowAllClosed );
		app.on( 'ready', Kernel.onReady );
		app.on( 'activate', Kernel.onActivate );
	}

	static bootstrap ( canLoadCache: boolean )
	{
		Commands.register();
		Kernel.setGlobals( canLoadCache );
	}
}