"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAccessTokenForApi = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const endpoints_config_1 = require("../config/endpoints.config");
// Ez a middleware ellenőrzi,hogy van-e accessToken, ha nincs akkor lép működésbe az axios interceptor API route-ok esetében
// Ha itt vagyunk tuti van REFRESH_TOKEN, mert a next.js middleware-ből ezt már ellenőrözm
const authenticateAccessTokenForApi = (req, res, next) => {
    // az access token-re van itt szükségem
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
        return res.status(404).json({ errorMessage: 'accessToken not found' });
    jsonwebtoken_1.default.verify(accessToken, endpoints_config_1.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ errorMessage: 'accessToken expired' });
        if (!decoded)
            return res.status(404).json({ errorMessage: 'user not found' });
        req.user = decoded;
        next();
    });
};
exports.authenticateAccessTokenForApi = authenticateAccessTokenForApi;
