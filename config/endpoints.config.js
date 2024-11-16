"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_PASSWORD = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
// Load environment variables before anything else
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../.env') });
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
exports.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
