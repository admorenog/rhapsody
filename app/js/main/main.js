const { app, BrowserWindow } = require('electron');
const ElectronViewRenderer = require('electron-view-renderer');
const fs = require('fs');
const path = require('path');
let config = JSON.parse(fs.readFileSync(app.getAppPath() + path.sep + 'config.json'));
let ctx = { config: config, render: null, mainWindow: null };
ctx.render = new ElectronViewRenderer({
    viewPath: 'app/views',
    viewProtcolName: 'view',
    useAssets: true,
    assetsPath: 'assets',
    assetsProtocolName: 'asset'
});
ctx.render.use('ejs');
function createWindow() {
    ctx.mainWindow = new BrowserWindow({ width: 800, height: 600 });
    ctx.render.load(ctx.mainWindow, 'main', { ctx: ctx });
    if (config.debug) {
        ctx.mainWindow.webContents.openDevTools();
    }
    ctx.mainWindow.on('closed', function () {
        ctx.mainWindow = null;
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin' || !config.debug) {
        app.quit();
    }
});
app.on('activate', function () {
    if (ctx.mainWindow === null) {
        createWindow();
    }
});
require('./js/main/menu');
require('./js/main/tray');
//# sourceMappingURL=main.js.map