"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUserCredentials = void 0;
const authenticateUserCredentials = (req, res, next) => {
    const loggedInUserID = req.user.userId;
    const userToModify = req.query.userToModify;
    if (!userToModify)
        return res.status(404).json({ msg: 'Required userToModify param field' });
    if (userToModify != loggedInUserID)
        return res.status(401).json({ msg: "You can't modify this resource" });
    next();
};
exports.authenticateUserCredentials = authenticateUserCredentials;
