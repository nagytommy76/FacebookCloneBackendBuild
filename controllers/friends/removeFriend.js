"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFriendController = void 0;
const user_1 = require("../../models/user/user");
const removeFriendController = async (request, response) => {
    const loggedInUserId = request.user?.userId;
    const friendId = request.body.friendId;
    try {
        await user_1.User.updateOne({ _id: friendId }, { $pull: { friends: { friend: loggedInUserId } } });
        await user_1.User.updateOne({ _id: loggedInUserId }, { $pull: { friends: { friend: friendId } } });
        response.status(201).json({ msg: 'deleted' });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.removeFriendController = removeFriendController;
