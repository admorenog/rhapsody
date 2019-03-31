"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_view_renderer_1 = require("electron-view-renderer");
const fs = require("fs");
const path = require("path");
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
        Main.render = new electron_view_renderer_1.default({
            viewPath: 'app/views',
            viewProtcolName: 'view',
            useAssets: true,
            assetsPath: 'assets',
            assetsProtocolName: 'asset'
        });
        Main.render.use('ejs');
        Main.render.load(Main.mainWindow, 'main', { ctx: Main });
        if (Main.config.debug) {
            Main.mainWindow.webContents.openDevTools();
        }
    }
    static onActivate() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (Main.mainWindow === null) {
            Main.onReady();
        }
    }
    static readConfig() {
        let configPath = electron_1.app.getAppPath() + path.sep + 'config.json';
        return fs.readFileSync(configPath).toJSON();
    }
    static main(app, browserWindow) {
        Main.config = Main.readConfig();
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
        Main.application.on('activate', Main.onActivate);
        Main.mainWindow.on('closed', Main.onClosed);
    }
}
exports.default = Main;
require('./menu');
require('./tray');
