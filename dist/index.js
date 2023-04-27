"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Logger_1 = __importStar(require("./Logger"));
const Login_1 = require("./bot/Login");
const env_1 = require("./utils/env");
const puppeteer_1 = __importDefault(require("puppeteer"));
const page_extension_1 = require("./bot/page-extension");
const LikeByHashtagScript_1 = __importDefault(require("./bot/scripts/LikeByHashtagScript"));
const database_1 = require("./database");
Logger_1.default.level = Logger_1.LoggingLevel.DEBUG;
const CREDENTIALS = {
    username: env_1.env.str("IG_USER"),
    password: env_1.env.str("IG_PASS"),
};
const CONFIGURATION = {
    hashtags: env_1.env.str("HASHTAGS"),
    maxPostDays: env_1.env.int("MAX_POST_DAYS"),
    likesPerHashtag: env_1.env.int("LIKES_PER_HASHTAG"),
    shuffle: env_1.env.bool("SHUFFLE"),
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.db.likeTask.create({
        data: {
            maxPostDays: CONFIGURATION.maxPostDays,
            likesPerHashtag: CONFIGURATION.likesPerHashtag,
            hashtags: CONFIGURATION.hashtags,
            shuffle: !!CONFIGURATION.shuffle,
        },
    });
    const browser = yield puppeteer_1.default.launch({
        headless: env_1.env.bool("HEADLESS"),
    });
    try {
        const page = yield initPage(browser);
        const likeScript = new LikeByHashtagScript_1.default();
        yield likeScript.exec(CONFIGURATION, CREDENTIALS, page);
    }
    catch (err) {
        Logger_1.default.error("errore senza catch...", err);
    }
    finally {
        yield browser.close();
    }
}))();
function initPage(browser) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        yield page.setViewport({
            width: env_1.env.int("VIEWPORT_WIDTH"),
            height: env_1.env.int("VIEWPORT_HEIGHT"),
        });
        const extPage = (0, page_extension_1.extendPage)(page);
        yield (0, Login_1.instagramLogin)(extPage, CREDENTIALS);
        return extPage;
    });
}
