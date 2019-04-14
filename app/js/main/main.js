"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// import * as ElectronViewRenderer from 'electron-view-renderer';
// import ElectronViewRenderer from 'electron-view-renderer';
const Config_1 = require("./Config");
const Systray_1 = require("./Systray");
const MainMenu_1 = require("./MainMenu");
const ElectronViewRenderer = require('electron-view-renderer');
class Main {
    static onWindowAllClosed() {
        if (process.platform !== 'darwin' || !Main.config.debug) {
            Main.application.quit();
        }
    }
    static onClosed() {
        // Dereference the window object.
        Main.mainWindow = null;
    }
    static onReady() {
        Main.mainWindow = new electron_1.BrowserWindow({ width: 800, height: 600 });
        // mainWindow.loadFile('main.html');
        if (Main.config.debug) {
            Main.mainWindow.webContents.openDevTools();
        }
        Main.Tray = new Systray_1.default();
        Main.render.load(Main.mainWindow, 'main', { ctx: Main.getContext() });
        Main.mainWindow.on('closed', Main.onClosed);
    }
    static onActivate() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (Main.mainWindow === null) {
            Main.onReady();
        }
    }
    static initConfig() {
        return new Config_1.default();
    }
    static initRender() {
        let render = new ElectronViewRenderer({
            viewPath: 'app/views',
            viewProtcolName: 'view',
            useAssets: false,
            assetsPath: 'assets',
            assetsProtocolName: 'asset'
        });
        render.use('ejs');
        return render;
    }
    static initMenu() {
        let menu = new MainMenu_1.default();
        return menu;
    }
    static getContext() {
        return {
            config: this.config
        };
    }
    static main(app, browserWindow) {
        Main.application = app;
        Main.BrowserWindow = browserWindow;
        Main.config = Main.initConfig();
        Main.menu = Main.initMenu();
        Main.render = Main.initRender();
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
        Main.application.on('activate', Main.onActivate);
    }
}
exports.default = Main;
