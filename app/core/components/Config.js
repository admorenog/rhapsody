"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs = require("fs");
const path = require("path");
class Config {
    static config(configVar, configValue) {
        Config.loadConfigVars();
        if (configValue !== undefined) {
            eval('Config.configVars.' + configVar + ' = configValue');
        }
        let configToReturn = null;
        if (configVar !== undefined) {
            configToReturn = eval('Config.configVars.' + configVar);
        }
        else {
            configToReturn = Config.configVars;
        }
        return configToReturn;
    }
    static env(envVar, envValue) {
        Config.loadEnvVars();
        if (envValue !== undefined) {
            Config.envVars[envVar] = envValue;
        }
        let envToReturn = null;
        if (envVar !== undefined) {
            envToReturn = Config.envVars[envVar];
        }
        else {
            envToReturn = Config.envVars;
        }
        return envToReturn;
    }
    static loadConfigVars() {
        if (this.configVars === undefined) {
            let configFolder = (electron_1.app.getAppPath() + path.sep +
                Config.configFolder + path.sep);
            let configFiles = fs.readdirSync(configFolder);
            this.configVars = {};
            for (let idxCfgFile = 0; idxCfgFile < configFiles.length; idxCfgFile++) {
                let filePath = configFolder + path.sep + configFiles[idxCfgFile];
                let fileName = configFiles[idxCfgFile].replace(new RegExp(Config.configExtension, 'g'), "");
                let configAsText = fs.readFileSync(filePath, Config.encoding);
                let configLoaded = eval(configAsText);
                Config.configVars[fileName] = configLoaded;
            }
        }
    }
    static loadEnvVars() {
        if (this.envVars === undefined) {
            let fullname = electron_1.app.getAppPath() + path.sep + Config.envfile;
            let envVars = JSON.parse(fs.readFileSync(fullname, Config.encoding));
            this.envVars = envVars;
        }
    }
    static setGlobals() {
        global["env"] = Config.env;
        global["config"] = Config.config;
    }
}
Config.configFolder = 'config';
Config.configExtension = '.js';
Config.encoding = 'utf-8';
Config.envfile = ".env";
exports.default = Config;
//# sourceMappingURL=Config.js.map