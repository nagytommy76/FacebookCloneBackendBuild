"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = void 0;
const errorResponse = (isError, msg, path, value = '') => {
    return {
        errors: [
            {
                isError,
                msg,
                path,
                value,
            },
        ],
    };
};
exports.errorResponse = errorResponse;
