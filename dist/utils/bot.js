"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnglish = exports.waitrandms = exports.waitms = exports.byXpath = void 0;
const env_1 = require("./env");
function byXpath(xpath) {
    return `xpath/${xpath}`;
}
exports.byXpath = byXpath;
function waitms(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.waitms = waitms;
function waitrandms(min = 1000, max = 5000) {
    return waitms(Math.random() * (max - min) + min);
}
exports.waitrandms = waitrandms;
exports.isEnglish = env_1.env.str("LANGUAGE") == "en";
