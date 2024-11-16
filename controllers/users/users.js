"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUserController = exports.checkAccessTokenValidityController = exports.checkRefreshTokenValidityController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const endpoints_config_1 = require("../../config/endpoints.config");
const signtTokens_1 = require("./helpers/signtTokens");
// ez a controller fut le a next.js middleware-ből, ha ez pass-ol tuti van refreshTokenem a többi controller/middleware-nél
const checkRefreshTokenValidityController = (req, res) => {
    // Ide a refresh token kell
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
        return res.status(404).json({ errorMessage: 'refreshToken not found' });
    try {
        jsonwebtoken_1.default.verify(refreshToken, endpoints_config_1.REFRESH_TOKEN_SECRET, (error, decoded) => {
            // Nem érvényes a refresh token, így a usernek ki kell lépnie
            if (error)
                return res.status(401).json({ errorMessage: 'refreshToken expired' });
            res.sendStatus(201);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.checkRefreshTokenValidityController = checkRefreshTokenValidityController;
// Ezt fogom elérni majd az axios interceptorból
// Itt is tuti van refreshTokenem..
const checkAccessTokenValidityController = (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
        return res.status(404).json({ errorMessage: 'refreshToken not found' });
    try {
        jsonwebtoken_1.default.verify(refreshToken, endpoints_config_1.REFRESH_TOKEN_SECRET, (error, decoded) => {
            if (error)
                return res.status(403).json({ errorMessage: 'refreshToken expired' });
            const newAccessToken = jsonwebtoken_1.default.sign({
                userId: decoded.userId,
                email: decoded.email,
                iat: decoded.iat,
                exp: decoded.exp,
            }, endpoints_config_1.ACCESS_TOKEN_SECRET);
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: signtTokens_1.ACCESS_TOKEN_EXPIRES_IN_MILLISEC,
            }).sendStatus(201);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.checkAccessTokenValidityController = checkAccessTokenValidityController;
const logoutUserController = async (req, res) => {
    // [0]: refreshToken [1]: accessToken
    const cookies = req.headers.cookie?.split(';');
    if (!cookies)
        return res.sendStatus(204);
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true });
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'none', secure: true });
    res.status(200).json({ message: 'Sikeres kijelentkezés' });
};
exports.logoutUserController = logoutUserController;
