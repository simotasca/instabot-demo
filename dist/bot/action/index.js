"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followAction = exports.likeAction = void 0;
var like_1 = require("./like");
Object.defineProperty(exports, "likeAction", { enumerable: true, get: function () { return __importDefault(like_1).default; } });
var follow_1 = require("./follow");
Object.defineProperty(exports, "followAction", { enumerable: true, get: function () { return __importDefault(follow_1).default; } });
