"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs = require("fs");
const path = require("path");
class Config {
    constructor(filename) {
        this.filename = 'config.json';
        this.encoding = 'utf-8';
        this.debug = true;
        this.filename = filename || this.filename;
        let fullname = electron_1.app.getAppPath() + path.sep + this.filename;
        let config = JSON.parse(fs.readFileSync(fullname, this.encoding));
        this.debug = config.debug;
    }
}
exports.default = Config;
