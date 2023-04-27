"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingLevel = void 0;
const chalk_1 = __importDefault(require("chalk"));
const date_1 = require("./utils/date");
var LoggingLevel;
(function (LoggingLevel) {
    LoggingLevel[LoggingLevel["DEBUG"] = 3] = "DEBUG";
    LoggingLevel[LoggingLevel["ALL"] = 2] = "ALL";
    LoggingLevel[LoggingLevel["ERROR"] = 1] = "ERROR";
    LoggingLevel[LoggingLevel["NONE"] = 0] = "NONE";
})(LoggingLevel = exports.LoggingLevel || (exports.LoggingLevel = {}));
function getInfo(logType) {
    let label;
    switch (logType) {
        case "dev":
            label = chalk_1.default.green("DEBUG");
            break;
        case "log":
            label = chalk_1.default.cyan("INFO");
            break;
        case "err":
            label = chalk_1.default.red("ERROR");
            break;
    }
    return chalk_1.default.bold(`igbot: [${label}] ${(0, date_1.dateToTimeString)(new Date())}`);
}
class Logger {
    static set level(level) {
        this._level = level;
    }
    static get level() {
        return this._level;
    }
    static is(level) {
        return this.level >= level;
    }
    static dev(msg) {
        this.is(LoggingLevel.DEBUG) && console.log(getInfo("dev"), msg);
    }
    static log(msg) {
        this.is(LoggingLevel.ALL) && console.log(getInfo("log"), msg);
    }
    static error(msg, err) {
        this.is(LoggingLevel.ERROR) && console.error(getInfo("err"), msg);
        this.is(LoggingLevel.DEBUG) && err && console.error(err);
    }
}
exports.default = Logger;
Logger._level = LoggingLevel.ALL;
