import { app, BrowserWindow } from 'electron';
// import * as ElectronViewRenderer from 'electron-view-renderer';
// import ElectronViewRenderer from 'electron-view-renderer';
import Config from '../app/controller/Config';
import Systray from '../app/controller/Systray';
import * as SystrayConfig from '../config/systray'

import MainMenu from '../app/controller/MainMenu';


const ElectronViewRenderer = require( 'electron-view-renderer' );

export default class Main
{
	static config : Config;
	static render: any;
	static mainWindow: Electron.BrowserWindow;
	static application: Electron.App;
	static menu : MainMenu;
	static Tray: Systray;
	static BrowserWindow: typeof BrowserWindow;

	private static onWindowAllClosed (): void
	{
		if ( process.platform !== 'darwin' || !Main.config.debug )
		{
			Main.application.quit();
		}
	}

	private static onClosed (): void
	{
		// Dereference the window object.
		Main.mainWindow = null;
	}

	private static onReady (): void
	{
		Main.mainWindow = new BrowserWindow( { width: 800, height: 600 } );

		if ( Main.config.debug )
		{
			Main.mainWindow.webContents.openDevTools()
		}

		Main.Tray = new Systray();

		Main.render.load( Main.mainWindow, 'main', { ctx: Main.getContext() } );

		Main.mainWindow.on( 'closed', Main.onClosed );
	}

	private static onActivate (): void
	{
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if ( Main.mainWindow === null )
		{
			Main.onReady();
		}
	}

	private static initConfig ()
	{
		return new Config();
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
		let menu = new MainMenu();
		return menu;
	}

	private static getContext()
	{
		return {
			config : this.config
		}
	}

	static main ( app: Electron.App, browserWindow: typeof BrowserWindow )
	{
		Main.application = app;
		Main.BrowserWindow = browserWindow;
		Main.config = Main.initConfig();
		Main.menu = Main.initMenu();
		Main.render = Main.initRender();
		Main.application.on( 'window-all-closed', Main.onWindowAllClosed );
		Main.application.on( 'ready', Main.onReady );
		Main.application.on( 'activate', Main.onActivate );
	}
}