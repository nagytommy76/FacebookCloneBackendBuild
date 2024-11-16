"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authValidator_1 = require("./validators/authValidator");
const authValidationMiddleware_1 = require("../../middlewares/authValidationMiddleware");
const users_1 = require("../../controllers/users/users");
const login_1 = require("../../controllers/users/login");
const register_1 = require("../../controllers/users/register");
class UserApi {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.post('/register', authValidator_1.ValidateRegister, authValidationMiddleware_1.authValidationMiddleware, register_1.registerUserController);
        this.router.post('/login', authValidator_1.ValidateLogin, authValidationMiddleware_1.authValidationMiddleware, login_1.loginUserController);
        this.router.post('/logout', users_1.logoutUserController);
        this.router.post('/refresh-token', users_1.checkRefreshTokenValidityController);
        this.router.post('/generate-access-token', users_1.checkAccessTokenValidityController);
    }
}
exports.default = UserApi;
