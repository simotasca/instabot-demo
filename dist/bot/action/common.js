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
exports.doAction = exports.ActionType = void 0;
const database_1 = require("../../database");
const actions_1 = require("../../database/actions");
const bot_1 = require("../../utils/bot");
const errors_1 = require("../errors");
const limits_1 = require("../limits");
var ActionType;
(function (ActionType) {
    ActionType[ActionType["FOLLOW"] = 0] = "FOLLOW";
    ActionType[ActionType["LIKE"] = 1] = "LIKE";
    ActionType[ActionType["ANY"] = 2] = "ANY";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
function doAction(type, check, info, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkActions();
        yield check();
        // init db action
        let action = yield database_1.db.action.create({
            data: {
                type: ActionType[type],
                date: new Date(),
            },
        });
        // add action info
        for (const [key, value] of Object.entries(info)) {
            yield database_1.db.actionInfo.create({
                data: {
                    actionId: action.id,
                    key,
                    value,
                },
            });
        }
        try {
            // execute action
            yield cb(action.id);
        }
        catch (e) {
            if (e instanceof errors_1.ActionError) {
                // revert action in case of error
                yield database_1.db.action.delete({ where: { id: action.id } });
                // actionInfo is deleted by cascade
            }
            else {
                throw e;
            }
        }
    });
}
exports.doAction = doAction;
function checkActions() {
    return __awaiter(this, void 0, void 0, function* () {
        // check for daily action limit
        if ((yield (0, actions_1.todayActionCount)()) >= limits_1.MAX_ACTIONS_PER_DAY) {
            throw new errors_1.DailyActionError();
        }
        // wait for minimum action delta
        const lastActionDate = yield (0, actions_1.getLastActionDate)();
        let lastActionLimit = new Date();
        lastActionLimit.setTime(lastActionLimit.getTime() - limits_1.MIN_ACTION_WAIT_MS);
        if (lastActionDate > lastActionLimit) {
            const delta = (lastActionDate.getTime() - lastActionLimit.getTime()) * 0.8;
            yield (0, bot_1.waitms)(limits_1.MIN_ACTION_WAIT_MS - delta);
        }
    });
}
