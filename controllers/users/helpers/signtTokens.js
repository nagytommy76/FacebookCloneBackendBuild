"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessAndRefreshToken = exports.ACCESS_TOKEN_EXPIRES_IN_MILLISEC = exports.ACCESS_TOKEN_EXPIRES_IN = exports.REFRESH_TOKEN_EXPIRES_IN_MILLISEC = exports.REFRESH_TOKEN_EXPIRES_IN = void 0;
const user_1 = require("../../../models/user/user");
const endpoints_config_1 = require("../../../config/endpoints.config");
const convertMilsec_1 = require("./convertMilsec");
exports.REFRESH_TOKEN_EXPIRES_IN = '1day';
exports.REFRESH_TOKEN_EXPIRES_IN_MILLISEC = (0, convertMilsec_1.convertStringToMillisec)(exports.REFRESH_TOKEN_EXPIRES_IN);
exports.ACCESS_TOKEN_EXPIRES_IN = '15min';
exports.ACCESS_TOKEN_EXPIRES_IN_MILLISEC = (0, convertMilsec_1.convertStringToMillisec)(exports.ACCESS_TOKEN_EXPIRES_IN);
const signAccessAndRefreshToken = (userId, email) => {
    const accessToken = user_1.User.jwtAccessTokenSign(userId, email, endpoints_config_1.ACCESS_TOKEN_SECRET, exports.ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = user_1.User.jwtRefreshTokenSign(userId, email, endpoints_config_1.REFRESH_TOKEN_SECRET, exports.REFRESH_TOKEN_EXPIRES_IN);
    return { accessToken, refreshToken };
};
exports.signAccessAndRefreshToken = signAccessAndRefreshToken;
