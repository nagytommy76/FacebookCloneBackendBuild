"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUsersNotification = exports.setActiveNotifications = exports.getNotifications = void 0;
const user_1 = require("../../models/user/user");
const getNotifications = async (request, response) => {
    try {
        const userId = request.user?.userId;
        const user = await user_1.User.findById(userId).select('notifications');
        response
            .status(200)
            .json({ notifications: user?.notifications.length === 0 ? null : user?.notifications });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.getNotifications = getNotifications;
const setActiveNotifications = async (request, response) => {
    try {
        const userId = request.user.userId;
        const notificationId = request.body.notificationId;
        const foundUsersNotification = await user_1.User.updateOne({
            _id: userId,
            notifications: { $elemMatch: { _id: notificationId } },
        }, {
            $set: {
                'notifications.$.isRead': true,
            },
        });
        response.status(200).json({ foundUsersNotification });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.setActiveNotifications = setActiveNotifications;
const removeUsersNotification = async (request, response) => {
    const userId = request.user.userId;
    const notificationId = request.body.notificationId;
    try {
        const foundUser = await user_1.User.findById(userId).select('notifications');
        if (!foundUser)
            return response.status(404).json({ msg: 'User not found' });
        foundUser.notifications = foundUser.notifications.filter((notification) => notification._id != notificationId);
        await foundUser.save();
        return response.status(200).json({ notificationId, foundUser });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.removeUsersNotification = removeUsersNotification;
