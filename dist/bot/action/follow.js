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
const actions_1 = require("../../database/actions");
const errors_1 = require("../errors");
const limits_1 = require("../limits");
const common_1 = require("./common");
function followAction(info, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, common_1.doAction)(common_1.ActionType.FOLLOW, checkFollow, info, cb);
    });
}
exports.default = followAction;
function checkFollow() {
    return __awaiter(this, void 0, void 0, function* () {
        const lastHourFollows = yield (0, actions_1.lastHourActionCount)(common_1.ActionType.FOLLOW);
        if (lastHourFollows >= limits_1.MAX_FOLLOW_PER_HOUR) {
            throw new errors_1.SkipTaskError("Raggiunto il numero massimo di follow in un'ora, riprova più tardi.");
        }
        const todaysFollows = yield (0, actions_1.todayActionCount)(common_1.ActionType.FOLLOW);
        if (todaysFollows >= limits_1.MAX_FOLLOW_PER_DAY) {
            throw new errors_1.SkipTaskError("Raggiunto il numero massimo di follow giornalieri, riprova domani.");
        }
    });
}
