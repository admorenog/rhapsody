"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
class Systray {
    constructor(systrayConfig) {
        this.iconPath = './resources/images/icon.png';
        this.tooltip = "Flex query builder beta";
        this.setIcon(electron_1.app.getAppPath() + path.sep + systrayConfig.iconpath);
        this.setMenu(systrayConfig.menu);
        this.tray = new electron_1.Tray(this.icon);
        this.tray.setToolTip(systrayConfig.tooltip);
        this.tray.setContextMenu(this.menu);
    }
    setIcon(icon = null) {
        if (icon != null) {
            this.iconPath = icon;
        }
        this.icon = electron_1.nativeImage.createFromPath(this.iconPath);
        this.icon = this.icon.resize({ width: 16, height: 16 });
    }
    setMenu(menu) {
        if (menu == null) {
            // TODO: cambiar esto por algo por defecto como un about Rhapsody
            this.menu = electron_1.Menu.buildFromTemplate([
                { label: 'Item1', type: 'radio' },
                { label: 'Item2', type: 'radio' },
                { label: 'Item3', type: 'radio', checked: true },
                { label: 'Item4', type: 'radio' }
            ]);
        }
        else {
            this.menu = electron_1.Menu.buildFromTemplate(menu);
        }
    }
}
exports.default = Systray;
//# sourceMappingURL=Systray.js.map