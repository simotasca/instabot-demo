"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotStartedError = exports.BotError = exports.StrategyError = exports.TaskError = exports.ActionError = exports.SkipTaskError = exports.DailyActionError = exports.OfflineError = void 0;
class OfflineError extends Error {
}
exports.OfflineError = OfflineError;
class DailyActionError extends Error {
    constructor() {
        super("Raggiunto il numero massimo di azioni giornaliere");
    }
}
exports.DailyActionError = DailyActionError;
class SkipTaskError extends Error {
}
exports.SkipTaskError = SkipTaskError;
class ActionError extends Error {
}
exports.ActionError = ActionError;
class TaskError extends Error {
}
exports.TaskError = TaskError;
class StrategyError extends Error {
}
exports.StrategyError = StrategyError;
class BotError extends Error {
}
exports.BotError = BotError;
class NotStartedError extends Error {
    constructor() {
        super("Tentativo di interagire con il browser fallito. Sessione non attiva");
    }
}
exports.NotStartedError = NotStartedError;
