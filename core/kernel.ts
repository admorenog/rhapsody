import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import Config from './components/Config';
import Systray from './components/Systray';
import Menu from './components/Menu';
import WindowRenderers from './system/WindowRenderers';

declare var config: Function;
declare var kernel: typeof Kernel;

const ElectronViewRenderer = require( 'electron-view-renderer' );

export default class Kernel
{
	static BrowserWindow: typeof Electron.BrowserWindow;
	static mainWindow: Electron.BrowserWindow;
	static loader: Electron.BrowserWindow;

	static windows: WindowRenderers;
	static application: Electron.App;
	static menu: Menu;
	static systray: Systray;
	static config: Config;
	static render: any;

	private static onWindowAllClosed (): void
	{
		if ( process.platform !== 'darwin' || !Config.config( "debug" ) )
		{
			Kernel.application.quit();
		}
	}

	private static onReady (): void
	{
		let mainWindow = new BrowserWindow(
			{ width: 800, height: 600, show: true }
		);

		let loaderWindow = new BrowserWindow( {
			width: 350, height: 400,
			frame: false, alwaysOnTop: true,
			show: false
		} );

		Kernel.windows.add( "main", mainWindow );
		Kernel.windows.load( "main", { ctx : Kernel.getContext() } );

		Kernel.windows.add( "load/loader", loaderWindow );
		Kernel.windows.load( "load/loader", { ctx : Kernel.getContext() } );

		Kernel.systray = new Systray( config( "systray" ) );

		//Kernel.mainWindow.on( 'closed', Kernel.onClosed );

		//Kernel.mainWindow.on( 'ready-to-show', Kernel.mainWindow.show );

		//setTimeout( function() { kernel.loader.hide(); }, 2000 );
	}

	private static onActivate (): void
	{
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if ( Kernel.mainWindow === null )
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

	static bootstrap ( app: Electron.App)
	{
		Config.setGlobals();
		Kernel.menu = Kernel.initMenu();
		Kernel.application = app;
		Kernel.menu = Kernel.initMenu();
		Kernel.windows = new WindowRenderers();
		Kernel.application.on( 'window-all-closed', Kernel.onWindowAllClosed );
		Kernel.application.on( 'ready', Kernel.onReady );
		Kernel.application.on( 'activate', Kernel.onActivate );

		global[ "kernel" ] = this;
	}
}