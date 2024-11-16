"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserController = void 0;
const user_1 = require("../../models/user/user");
const errorResponse_1 = require("./helpers/errorResponse");
const signtTokens_1 = require("./helpers/signtTokens");
const signtTokens_2 = require("./helpers/signtTokens");
const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { foundUser, isPasswordCorrect } = await user_1.User.comparePassword(email, password);
        if (!isPasswordCorrect)
            return res.status(403).json((0, errorResponse_1.errorResponse)(true, 'Helytelen jelszó!', 'password'));
        const { accessToken, refreshToken } = (0, signtTokens_1.signAccessAndRefreshToken)(foundUser._id, foundUser.email);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: signtTokens_2.REFRESH_TOKEN_EXPIRES_IN_MILLISEC,
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: signtTokens_2.ACCESS_TOKEN_EXPIRES_IN_MILLISEC,
        })
            .status(200)
            .json({
            isPasswordCorrect,
            accessToken,
            userId: foundUser._id,
            userName: `${foundUser.firstName} ${foundUser.sureName}`,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.loginUserController = loginUserController;
