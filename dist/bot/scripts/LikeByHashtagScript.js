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
exports.checkLikeConfig = void 0;
const Logger_1 = __importDefault(require("../../Logger"));
const bot_1 = require("../../utils/bot");
const action_1 = require("../action");
const database_1 = require("../../database");
const xpaths_1 = require("../xpaths/xpaths");
const errors_1 = require("../errors");
const constants_1 = require("../../constants");
const login_1 = require("../xpaths/login");
const date_1 = require("../../utils/date");
function checkLikeConfig(obj) {
    if (!obj.hashtags || !obj.maxPostDays || !obj.likesPerHashtag) {
        throw new Error("Conigurazione script errata!");
    }
    return obj;
}
exports.checkLikeConfig = checkLikeConfig;
class LikeByHashtagScript {
    constructor() {
        this.taskName = "LIKE_BY_HASHTAG";
    }
    exec(config, credentials, page) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = checkLikeConfig(config);
            this.page = page;
            this.credentials = credentials;
            this.task = yield database_1.db.likeTask.create({
                data: {
                    maxPostDays: this.config.maxPostDays,
                    likesPerHashtag: this.config.likesPerHashtag,
                    hashtags: this.config.hashtags,
                    shuffle: !!this.config.shuffle,
                },
            });
            for (const hashtag of this.task.hashtags.split("#")) {
                const hashOk = hashtag.replace(/\s/g, "");
                if (hashOk != "")
                    yield this.likeHashtag(hashtag);
            }
        });
    }
    likeHashtag(hashtag) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.log("Inizio likes per: #" + hashtag);
            yield this.openFirstHashtagPost(hashtag);
            yield (0, bot_1.waitrandms)(5000, 10000);
            let postIdx = -1;
            let completed = false;
            loop: while (!completed) {
                postIdx++;
                yield (0, bot_1.waitrandms)(1000, 5000);
                let postUser = yield this.getPostUser();
                Logger_1.default.log(`#${hashtag} - Utente post: ${postUser}`);
                // controllo che non sia un mio post
                if (this.credentials.username != postUser) {
                    // se il post è troppo vecchio non metto più like in questo hashtag
                    // a meno che non sia tra i post più popolari
                    const postPopolare = postIdx < 9;
                    const postRecente = yield this.isPostRecent(this.task.maxPostDays);
                    if (!postRecente && !postPopolare) {
                        completed = true;
                        Logger_1.default.log(`Finiti i post recenti o popolari in #${hashtag}`);
                        break loop;
                    }
                    // metto il LIKEEEEE
                    let { liked, reset, actionId } = yield this.doLikeAction(postUser);
                    // genero una likeTask action
                    if (liked && actionId) {
                        yield database_1.db.likeTaskAction.create({
                            data: { actionId: actionId, likeTaskId: this.task.id, hashtag },
                        });
                    }
                    Logger_1.default.log((liked ? "Like messo" : "Like non messo") + " #" + hashtag);
                    if (reset) {
                        Logger_1.default.log("Ricarico la pagina di #" + hashtag);
                        postIdx = 0;
                        yield this.openFirstHashtagPost(hashtag);
                    }
                }
                completed = yield this.areLikesCompleted(hashtag);
                if (!completed) {
                    try {
                        const nextBtnXpath = bot_1.isEnglish
                            ? xpaths_1.XPATH_NEXT_POST_BTN_EN
                            : xpaths_1.XPATH_NEXT_POST_BTN;
                        yield this.page.waitForXPathExt(nextBtnXpath, 5 * 1000, "Tasto prossimo post");
                        yield this.page.click((0, bot_1.byXpath)(nextBtnXpath));
                    }
                    catch (_a) {
                        completed = true;
                        Logger_1.default.log(`Finiti i post in #${hashtag}`);
                        break loop;
                    }
                }
            }
            const tot = yield database_1.db.likeTaskAction.count({
                where: { likeTaskId: this.task.id, hashtag },
            });
            Logger_1.default.log(`${tot} like completati per #${hashtag}`);
        });
    }
    doLikeAction(postUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = { liked: false, reset: false, actionId: -1 };
            if (yield this.isPostLiked()) {
                Logger_1.default.log("Like inserito in precedenza");
                return result;
            }
            yield (0, action_1.likeAction)({ account: postUser, postURL: this.page.url() }, (actionId) => __awaiter(this, void 0, void 0, function* () {
                const likeBtnXpath = bot_1.isEnglish
                    ? xpaths_1.XPATH_POST_LIKE_BTN_EN
                    : xpaths_1.XPATH_POST_LIKE_BTN;
                yield this.page.waitForXPathExt(likeBtnXpath, 5000, "bottone like");
                yield (0, bot_1.waitrandms)(1000, 3000);
                yield this.page.click((0, bot_1.byXpath)(likeBtnXpath));
                yield (0, bot_1.waitrandms)(1000, 5000);
                if (!(yield this.isPostLiked())) {
                    Logger_1.default.log("Il like non è stato inserito correttamente entro 5 secondi, ricarico la pagina dell'hashtag");
                    result.reset = true;
                    throw new errors_1.ActionError();
                }
                result.liked = true;
                result.actionId = actionId;
            }));
            yield (0, bot_1.waitrandms)(2000, 4000);
            return result;
        });
    }
    areLikesCompleted(hashtag) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield database_1.db.likeTaskAction.findMany({
                where: {
                    likeTaskId: this.task.id,
                    hashtag: hashtag,
                },
            })).length >= this.task.likesPerHashtag);
        });
    }
    openFirstHashtagPost(hashtag) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openHashtagPage(hashtag);
            yield this.page.waitForXPathExt(xpaths_1.XPATH_FIRST_POST, 20000, "Primo post");
            yield this.page.click((0, bot_1.byXpath)(xpaths_1.XPATH_FIRST_POST));
            Logger_1.default.log("Primo post cliccato");
        });
    }
    openHashtagPage(hashtag) {
        return __awaiter(this, void 0, void 0, function* () {
            // return true; se ha caricato e ci sono post
            // return false; se ha caricato e NON ci sono post
            // finchè la pagina non carica continuo a ricaricarla
            yield this.page.goto(constants_1.HASHTAG_PAGE_URL + hashtag);
            yield (0, bot_1.waitms)(5 * 1000);
            // aspetto il caricamento dei contenuti della pagina
            yield this.page.waitForXPathExt(bot_1.isEnglish ? login_1.XPATH_PROFILE_PICTURE_EN : login_1.XPATH_PROFILE_PICTURE, 20000, "Immagine profilo (validatore)");
            while (true) {
                try {
                    // check se la pagina contiene almeno un post
                    yield this.page.waitForXPathExt(xpaths_1.XPATH_FIRST_POST, 15000, "Primo post");
                    Logger_1.default.log("Pagina caricata");
                    return true;
                }
                catch (error) {
                    Logger_1.default.error("Primo post non trovato");
                }
                // se non trovo post potrebbe non esistere l'hashtag
                if (yield this.pageNotFound()) {
                    return false;
                }
                // se non è uno dei casi gestiti suppongo ci sia un problema e ricarico
                yield this.page.reload();
            }
        });
    }
    getPostUser() {
        return __awaiter(this, void 0, void 0, function* () {
            /** Ricerco l'username nell'alt dell'immagine perchè questa ha un XPATH più sicuro */
            const imgXPath = bot_1.isEnglish
                ? xpaths_1.XPATH_POST_PROFILE_PICTURE_EN
                : xpaths_1.XPATH_POST_PROFILE_PICTURE;
            yield this.page.waitForXPathExt(imgXPath, 10000, "Foto profilo del post");
            const profilePicAlt = yield this.page.getAttribute(imgXPath, "alt");
            if (profilePicAlt == null)
                throw new Error("Impossibile trovare l'username dalla foto profilo");
            let regexp = /(?<=Immagine del profilo di ).*/;
            if (bot_1.isEnglish)
                regexp = /.*(?='s profile picture)/;
            const match = profilePicAlt.match(regexp);
            if (!(match === null || match === void 0 ? void 0 : match.length))
                throw new Error("Impossibile leggere l'username dalla foto profilo");
            return match[0];
        });
    }
    isPostRecent(days) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForXPathExt(xpaths_1.XPATH_POST_DATE, 5000, "Data del post");
            const dateAttribute = yield this.page.getAttribute(xpaths_1.XPATH_POST_DATE, "datetime");
            const datetimePost = new Date(dateAttribute || "");
            const recentLimit = (0, date_1.subtractDate)(0, 0, days);
            const isRecent = datetimePost > recentLimit;
            return isRecent;
        });
    }
    isPostLiked() {
        return __awaiter(this, void 0, void 0, function* () {
            let isLiked = yield this.page
                .waitForXPath(xpaths_1.XPATH_LIKED_SVG, { timeout: 5000 })
                .catch(() => { });
            return !!isLiked;
        });
    }
    pageNotFound() {
        return __awaiter(this, void 0, void 0, function* () {
            let pageTitle = yield this.page.title();
            return pageTitle.includes(bot_1.isEnglish ? xpaths_1.TITLE_PAGE_NOT_FOUND_EN : xpaths_1.TITLE_PAGE_NOT_FOUND);
        });
    }
}
exports.default = LikeByHashtagScript;
