"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPATH_PROFILE_PICTURE_EN = exports.XPATH_PROFILE_PICTURE = exports.ID_LOGIN_ERROR_MSG = exports.XPATH_BTN_LOGIN_LOADING = exports.XPATH_BTN_LOGIN = exports.XPATH_TXT_PASSWORD = exports.XPATH_TXT_USERNAME = exports.XPATH_BTN_COOKIES_EN = exports.XPATH_BTN_COOKIES = void 0;
exports.XPATH_BTN_COOKIES = "//*[@role='dialog']//button[text() = 'Consenti solo i cookie essenziali']";
exports.XPATH_BTN_COOKIES_EN = "//*[@role='dialog']//button[text() = 'Only allow essential cookies']";
exports.XPATH_TXT_USERNAME = "//form//input[@type='text']";
exports.XPATH_TXT_PASSWORD = "//form//input[@type='password']";
exports.XPATH_BTN_LOGIN = "//form//button[@type='submit']";
exports.XPATH_BTN_LOGIN_LOADING = "//form//button[@type='submit' and disabled]";
exports.ID_LOGIN_ERROR_MSG = "slfErrorAlert";
// serve per verificare che il login sia avvenuto con successo
exports.XPATH_PROFILE_PICTURE = "//*[contains(@alt,'Immagine del profilo')]";
exports.XPATH_PROFILE_PICTURE_EN = "//*[contains(@alt,'s profile picture')]";
