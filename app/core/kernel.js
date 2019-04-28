"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const Config_1 = require("./components/Config");
const Systray_1 = require("./components/Systray");
const Menu_1 = require("./components/Menu");
const ElectronViewRenderer = require('electron-view-renderer');
class Kernel {
    static onWindowAllClosed() {
        if (process.platform !== 'darwin' || !Config_1.default.config("debug")) {
            Kernel.application.quit();
        }
    }
    static onClosed() {
        // Dereference the window object.
        Kernel.mainWindow = null;
    }
    static onReady() {
        Kernel.loader = new electron_1.BrowserWindow({
            width: 350, height: 400,
            frame: false, alwaysOnTop: true,
            show: false
        });
        Kernel.loader.loadFile(electron_1.app.getAppPath() + path.sep + 'app/src/views/templates/loader/loader.html');
        Kernel.loader.on('ready-to-show', Kernel.loader.show);
        Kernel.mainWindow = new electron_1.BrowserWindow({ width: 800, height: 600, show: false });
        if (Config_1.default.config('app.debug')) {
            Kernel.mainWindow.webContents.openDevTools();
        }
        Kernel.systray = new Systray_1.default(config("systray"));
        Kernel.render.load(Kernel.mainWindow, 'main', { ctx: Kernel.getContext() });
        Kernel.mainWindow.on('closed', Kernel.onClosed);
        Kernel.mainWindow.on('ready-to-show', Kernel.mainWindow.show);
        setTimeout(function () { kernel.loader.hide(); }, 2000);
    }
    static onActivate() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (Kernel.mainWindow === null) {
            Kernel.onReady();
        }
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
        let menu = new Menu_1.default();
        return menu;
    }
    static getContext() {
        return {
            config: config()
        };
    }
    static main(app, browserWindow) {
        Config_1.default.setGlobals();
        Kernel.application = app;
        Kernel.BrowserWindow = browserWindow;
        Kernel.menu = Kernel.initMenu();
        Kernel.render = Kernel.initRender();
        Kernel.application.on('window-all-closed', Kernel.onWindowAllClosed);
        Kernel.application.on('ready', Kernel.onReady);
        Kernel.application.on('activate', Kernel.onActivate);
        global["kernel"] = this;
    }
}
exports.default = Kernel;
//# sourceMappingURL=kernel.js.map