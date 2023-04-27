"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMidnight = exports.dateToTimeString = exports.dateToString = exports.subtractDate = void 0;
function subtractDate(years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, date = new Date()) {
    years && date.setFullYear(date.getFullYear() - years);
    months && date.setMonth(date.getMonth() - months);
    days && date.setDate(date.getDate() - days);
    hours && date.setHours(date.getHours() - hours);
    minutes && date.setMinutes(date.getMinutes() - minutes);
    seconds && date.setSeconds(date.getSeconds() - seconds);
    return date;
}
exports.subtractDate = subtractDate;
function dateToString(date) {
    return (date.getFullYear() +
        "/" +
        date.getMonth().toString().padStart(2, "0") +
        "/" +
        date.getDate().toString().padStart(2, "0") +
        " " +
        date.getHours().toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0") +
        ":" +
        date.getSeconds().toString().padStart(2, "0"));
}
exports.dateToString = dateToString;
function dateToTimeString(date) {
    return (date.getHours().toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0") +
        ":" +
        date.getSeconds().toString().padStart(2, "0"));
}
exports.dateToTimeString = dateToTimeString;
function getMidnight() {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    return midnight;
}
exports.getMidnight = getMidnight;
