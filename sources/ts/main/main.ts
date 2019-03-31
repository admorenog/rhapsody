import { app, BrowserWindow } from 'electron';
import ElectronViewRenderer from 'electron-view-renderer'
import * as fs from 'fs';
import * as path from 'path';

export default class Main {
	static config;
	static render : ElectronViewRenderer;
	static mainWindow: Electron.BrowserWindow;
	static application: Electron.App;
	static BrowserWindow : typeof BrowserWindow;

	private static onWindowAllClosed() : void {
		if (process.platform !== 'darwin' || !Main.config.debug) {
			Main.application.quit();
		}
	}

	private static onClosed() : void {
		// Dereference the window object.
		Main.mainWindow = null;
	}

	private static onReady() : void {
		Main.mainWindow = new BrowserWindow({ width: 800, height: 600 });
		// mainWindow.loadFile('main.html');

		Main.render = new ElectronViewRenderer({
			viewPath: 'app/views',
			viewProtcolName: 'view',
			useAssets: true,
			assetsPath: 'assets',
			assetsProtocolName: 'asset'
		})

		Main.render.use('ejs')

		Main.render.load(Main.mainWindow, 'main', { ctx: Main })

		if (Main.config.debug) {
			Main.mainWindow.webContents.openDevTools()
		}

	}

	private static onActivate() : void {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (Main.mainWindow === null) {
			Main.onReady();
		}
	}

	private static readConfig() {
		let configPath: string = app.getAppPath() + path.sep + 'config.json';
		return fs.readFileSync(configPath).toJSON();
	}

	static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
		Main.config = Main.readConfig();
		Main.BrowserWindow = browserWindow;
		Main.application = app;
		Main.application.on('window-all-closed', Main.onWindowAllClosed);
		Main.application.on('ready', Main.onReady);
		Main.application.on('activate', Main.onActivate);
		Main.mainWindow.on('closed', Main.onClosed);
	}
}

require('./menu')
require('./tray')