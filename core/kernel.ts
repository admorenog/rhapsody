import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import Config from './components/Config';
import Systray from './components/Systray';
import Menu from './components/Menu';

declare var config : Function;
declare var kernel : typeof Kernel;

const ElectronViewRenderer = require( 'electron-view-renderer' );

export default class Kernel
{
	static BrowserWindow: typeof BrowserWindow;
	static mainWindow: Electron.BrowserWindow;
	static loader: Electron.BrowserWindow;
	static windows : Array<Electron.BrowserWindow>;
	static application: Electron.App;
	static menu : Menu;
	static systray: Systray;
	static config : Config;
	static render: any;

	private static onWindowAllClosed (): void
	{
		if ( process.platform !== 'darwin' || !Config.config( "debug" ) )
		{
			Kernel.application.quit();
		}
	}

	private static onClosed (): void
	{
		// Dereference the window object.
		Kernel.mainWindow = null;
	}

	private static onReady (): void
	{
		Kernel.loader = new BrowserWindow( {
			width: 350, height: 400,
			frame : false, alwaysOnTop : true,
			show : false
		} );
		Kernel.loader.loadFile( app.getAppPath() + path.sep + 'app/src/views/templates/loader/loader.html' );
		Kernel.loader.on( 'ready-to-show', Kernel.loader.show );

		Kernel.mainWindow = new BrowserWindow( { width: 800, height: 600, show: false } );

		if ( Config.config( 'app.debug' ) )
		{
			Kernel.mainWindow.webContents.openDevTools()
		}

		Kernel.systray = new Systray( config( "systray" ) );

		Kernel.render.load( Kernel.mainWindow, 'main', { ctx: Kernel.getContext() } );

		Kernel.mainWindow.on( 'closed', Kernel.onClosed );

		Kernel.mainWindow.on( 'ready-to-show', Kernel.mainWindow.show );

		setTimeout( function() { kernel.loader.hide(); }, 2000 );
	}

	private static onActivate () : void
	{
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if ( Kernel.mainWindow === null )
		{
			Kernel.onReady();
		}
	}

	private static initRender()
	{
		let render = new ElectronViewRenderer( {
			viewPath: 'app/views',
			viewProtcolName: 'view',
			useAssets: false,
			assetsPath: 'assets',
			assetsProtocolName: 'asset'
		} );
		render.use( 'ejs' );
		return render;
	}

	private static initMenu()
	{
		let menu = new Menu();
		return menu;
	}

	private static getContext()
	{
		return {
			config : config()
		}
	}

	static main ( app: Electron.App, browserWindow: typeof BrowserWindow )
	{
		Config.setGlobals();
		Kernel.application = app;
		Kernel.BrowserWindow = browserWindow;
		Kernel.menu = Kernel.initMenu();
		Kernel.render = Kernel.initRender();
		Kernel.application.on( 'window-all-closed', Kernel.onWindowAllClosed );
		Kernel.application.on( 'ready', Kernel.onReady );
		Kernel.application.on( 'activate', Kernel.onActivate );

		global[ "kernel" ] = this;
	}
}