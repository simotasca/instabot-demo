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
exports.getLastActionDate = exports.lastHourActionCount = exports.todayActionCount = void 0;
const _1 = require(".");
const common_1 = require("../bot/action/common");
const date_1 = require("../utils/date");
function todayActionCount(actionType) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = { date: { gte: (0, date_1.getMidnight)() } };
        if (actionType !== undefined && actionType !== common_1.ActionType.ANY) {
            where.type = common_1.ActionType[actionType];
        }
        return yield _1.db.action.count({ where });
    });
}
exports.todayActionCount = todayActionCount;
function lastHourActionCount(actionType) {
    return __awaiter(this, void 0, void 0, function* () {
        const lastHour = (0, date_1.subtractDate)(0, 0, 0, 1);
        const where = { date: { gte: lastHour } };
        if (actionType !== undefined && actionType !== common_1.ActionType.ANY) {
            where.type = common_1.ActionType[actionType];
        }
        return yield _1.db.action.count({ where });
    });
}
exports.lastHourActionCount = lastHourActionCount;
function getLastActionDate() {
    return __awaiter(this, void 0, void 0, function* () {
        return ((yield _1.db.action.aggregate({ _max: { date: true } }))._max.date ||
            (0, date_1.subtractDate)(100));
    });
}
exports.getLastActionDate = getLastActionDate;
