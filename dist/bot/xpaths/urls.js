"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFollowerUrl = exports.API_FOLLOWERS_URL_CHUNK = void 0;
const constants_1 = require("../../constants");
exports.API_FOLLOWERS_URL_CHUNK = constants_1.INSTAGRAM_URL + "api/v1/friendships/";
const getUserFollowerUrl = (user) => constants_1.INSTAGRAM_URL + user + "/followers/";
exports.getUserFollowerUrl = getUserFollowerUrl;
