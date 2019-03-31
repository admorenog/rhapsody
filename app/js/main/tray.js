const { Tray, nativeImage } = require('electron');
let tray = null;
app.on('ready', () => {
    let iconPath = './resources/images/icon.png';
    let trayIcon = nativeImage.createFromPath(iconPath);
    trayIcon = trayIcon.resize({ width: 16, height: 16 });
    tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ]);
    tray.setToolTip('Flex query builder beta');
    tray.setContextMenu(contextMenu);
});
