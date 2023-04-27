"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendPage = void 0;
const bot_1 = require("../utils/bot");
function extendPage(page) {
    let downcast = page;
    downcast.waitForSelectorExt = (selector, timeout, elementName) => __awaiter(this, void 0, void 0, function* () {
        yield downcast.waitForSelector(selector, { timeout }).catch(() => {
            const elRef = elementName || `Elemento con selettore: ${selector}`;
            const timeRef = "non trovato" +
                (timeout ? ` entro ${Math.floor(timeout / 1000)} secondi}` : ".");
            throw new Error(`${elRef} ${timeRef}`);
        });
    });
    downcast.waitForXPathExt = (xPath, timeout, elementName) => __awaiter(this, void 0, void 0, function* () {
        return downcast.waitForSelectorExt((0, bot_1.byXpath)(xPath), timeout, elementName);
    });
    downcast.waitUntilNotFound = (selector, maxAttempts, timeSpan = 500, parent) => __awaiter(this, void 0, void 0, function* () {
        let context = parent ? parent : downcast;
        let attempts = 0;
        while (true) {
            attempts++;
            const result = yield context.$$(selector);
            if (result.length == 0) {
                return true;
            }
            if (attempts >= maxAttempts)
                break;
            yield (0, bot_1.waitms)(timeSpan);
        }
        return false;
    });
    downcast.getAttribute = (xpath, attributeName) => __awaiter(this, void 0, void 0, function* () {
        const element = (yield downcast.$x(xpath))[0];
        if (!element)
            throw new Error(`Attributo "${attributeName}" non trovato su "${xpath}"`);
        return (yield (yield element.getProperty(attributeName)).jsonValue());
    });
    downcast.triggerNavigation = (cb) => {
        return Promise.all([downcast.waitForNavigation(), cb]);
    };
    downcast.clickElement = (el) => {
        // @ts-ignore
        return el.evaluate((elem) => elem.click());
    };
    return downcast;
}
exports.extendPage = extendPage;
