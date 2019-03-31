const { app, BrowserWindow } = require('electron')
const ElectronViewRenderer = require('electron-view-renderer')
const fs = require('fs')
const path = require('path')

let config = JSON.parse(fs.readFileSync(app.getAppPath() + path.sep + 'config.json'));

let ctx = { config: config, render: null, mainWindow: null };

ctx.render = new ElectronViewRenderer({
	viewPath: 'app/views',
	viewProtcolName: 'view',
	useAssets: true,
	assetsPath: 'assets',
	assetsProtocolName: 'asset'
})

ctx.render.use('ejs')

function createWindow() {
	// Create the browser window.
	ctx.mainWindow = new BrowserWindow({ width: 800, height: 600 });
	// mainWindow.loadFile('main.html');

	ctx.render.load(ctx.mainWindow, 'main', { ctx: ctx })

	if (config.debug) {
		ctx.mainWindow.webContents.openDevTools()
	}

	// Emitted when the window is closed.
	ctx.mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		ctx.mainWindow = null
	});
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin' || !config.debug) {
		app.quit()
	}
});
app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (ctx.mainWindow === null) {
		createWindow()
	}
});

require('./js/main/menu')
require('./js/main/tray')