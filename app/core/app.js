#!/usr/local/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const kernel_1 = require("./kernel");
kernel_1.default.main(electron_1.app, electron_1.BrowserWindow);
//# sourceMappingURL=app.js.map