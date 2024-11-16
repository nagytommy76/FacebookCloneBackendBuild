"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMillisecToString = exports.convertStringToMillisec = void 0;
const ms_1 = __importDefault(require("ms"));
/**
 * @param time string. "1day", "1y"
 * @returns number, 10000 millisec
 */
const convertStringToMillisec = (time) => {
    return (0, ms_1.default)(time);
};
exports.convertStringToMillisec = convertStringToMillisec;
/**
 * @param time number. 4342234
 * @param format (60000, { long: true })          "1 minute"
            ms(2 * 60000, { long: true })         "2 minutes"
            ms(-3 * 60000, { long: true })        "-3 minutes"
            ms(ms('10 hours'), { long: true })    "10 hours"
 * @returns string, "28m"
 */
const convertMillisecToString = (millisec, format = false) => {
    return (0, ms_1.default)(millisec, { long: format });
};
exports.convertMillisecToString = convertMillisecToString;
