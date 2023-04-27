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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramLogin = void 0;
const Logger_1 = __importDefault(require("../Logger"));
const bot_1 = require("../utils/bot");
const login_1 = require("./xpaths/login");
class Login {
    constructor(page, credentials) {
        this.credentials = credentials;
        this.page = page;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.log(`Avvio procedura di login per utente "${this.credentials.username}"`);
            yield this.goToHome();
            yield (0, bot_1.waitms)(5 * 1000);
            if (yield this.isLoggedIn(10 * 1000)) {
                Logger_1.default.log(`Utente ${this.credentials.username} già loggato`);
                return;
            }
            yield this.acceptCookies();
            yield (0, bot_1.waitms)(5 * 1000);
            yield this.login();
        });
    }
    goToHome() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto("https://www.instagram.com/");
            Logger_1.default.log("Aperto instagram");
        });
    }
    acceptCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            const xpathBtnCookies = bot_1.isEnglish
                ? login_1.XPATH_BTN_COOKIES_EN
                : login_1.XPATH_BTN_COOKIES;
            // clicco il bottone
            yield this.page.waitForXPathExt(xpathBtnCookies, 50 * 1000, "Bottone dei cookies");
            yield this.page.click((0, bot_1.byXpath)(xpathBtnCookies));
            // aspetto la chiusura della popup
            yield this.page.waitUntilNotFound((0, bot_1.byXpath)(xpathBtnCookies), 10, 5 * 1000);
        });
    }
    isLoggedIn(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.page
                .waitForXPath(bot_1.isEnglish ? login_1.XPATH_PROFILE_PICTURE_EN : login_1.XPATH_PROFILE_PICTURE, { timeout })
                .catch(() => { }));
        });
    }
    clickLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForXPathExt(login_1.XPATH_BTN_LOGIN, 20 * 1000, "Bottone login");
            yield this.page.click((0, bot_1.byXpath)(login_1.XPATH_BTN_LOGIN));
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.log("inserimento credenziali");
            // inserimento nome utente
            yield this.page.waitForXPathExt(login_1.XPATH_TXT_USERNAME, 20 * 1000, "Input username");
            yield this.page.type((0, bot_1.byXpath)(login_1.XPATH_TXT_USERNAME), this.credentials.username, {
                delay: 80,
            });
            yield (0, bot_1.waitrandms)(2000, 5000);
            // inserimento password
            yield this.page.waitForXPathExt(login_1.XPATH_TXT_PASSWORD, 20 * 1000, "Input password");
            yield this.page.type((0, bot_1.byXpath)(login_1.XPATH_TXT_PASSWORD), this.credentials.password, {
                delay: 80,
            });
            yield (0, bot_1.waitrandms)(2000, 5000);
            // click login
            yield this.clickLogin();
            Logger_1.default.log("Login in corso...");
            let isErrMsg = !!(yield this.page
                .waitForSelector("#" + login_1.ID_LOGIN_ERROR_MSG, { timeout: 20 * 1000 })
                .catch(() => { }));
            if (isErrMsg) {
                Logger_1.default.log("Errore di login, procedo con altri tentativi");
            }
            let err = isErrMsg;
            let x = 0;
            if (err) {
                yield (0, bot_1.waitms)(1846);
                while (x < 5 && err) {
                    const waitLoading = yield this.page.waitUntilNotFound((0, bot_1.byXpath)(login_1.XPATH_BTN_LOGIN_LOADING), 5, 2000);
                    waitLoading && (yield this.clickLogin());
                    Logger_1.default.log(`-- tentativo ${x + 1}`);
                    if (yield this.isLoggedIn(30 * 1000)) {
                        err = false;
                        break;
                    }
                    x++;
                }
            }
            if (err) {
                throw new Error("Login fallito: Controlla le credenziali oppure riprova più tardi");
            }
            yield this.page.waitForXPathExt(bot_1.isEnglish ? login_1.XPATH_PROFILE_PICTURE_EN : login_1.XPATH_PROFILE_PICTURE, 30 * 1000, "Immagine del profilo");
            Logger_1.default.log("Login eseguito come " + this.credentials.username);
        });
    }
}
exports.default = Login;
function instagramLogin(page, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Login(page, credentials).execute();
    });
}
exports.instagramLogin = instagramLogin;
