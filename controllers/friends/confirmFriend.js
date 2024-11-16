"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmFriendshipController = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../../models/user/user");
const confirmFriendshipController = async (request, response) => {
    const loggedInUserId = new mongoose_1.Types.ObjectId(request.user?.userId);
    const friendId = new mongoose_1.Types.ObjectId(request.body.friendId);
    try {
        await user_1.User.updateOne({ _id: loggedInUserId, friends: { $elemMatch: { friend: { $eq: friendId } } } }, { $set: { 'friends.$.status': 'friends', 'friends.$.friendSince': new Date() } });
        const foundSender = await user_1.User.aggregate([
            {
                $match: {
                    _id: loggedInUserId,
                },
            },
            {
                $project: {
                    firstName: 1,
                    sureName: 1,
                    selectedProfilePicture: {
                        $filter: {
                            input: '$userDetails.profilePicturePath',
                            as: 'profilePic',
                            cond: { $eq: ['$$profilePic.isSelected', true] },
                        },
                    },
                    foundFriend: {
                        $filter: {
                            input: '$friends',
                            as: 'friend',
                            cond: { $eq: ['$$friend.friend', friendId] },
                        },
                    },
                },
            },
        ]);
        await user_1.User.updateOne({ _id: friendId, friends: { $elemMatch: { friend: { $eq: loggedInUserId } } } }, {
            $set: { 'friends.$.status': 'friends', 'friends.$.friendSince': new Date() },
            $push: {
                notifications: {
                    createdAt: new Date(),
                    isRead: false,
                    notificationType: 'isFriendConfirm',
                    userDetails: {
                        firstName: foundSender[0].firstName,
                        sureName: foundSender[0].sureName,
                        userId: foundSender[0]._id,
                        profilePicture: foundSender[0].selectedProfilePicture[0].path,
                    },
                },
            },
        });
        const foundReceiver = await user_1.User.findOne({
            _id: friendId,
            friends: { $elemMatch: { friend: { $eq: loggedInUserId } } },
        }).select(['friends.$', 'notifications']);
        if (request.getUser !== undefined) {
            const toSendUser = request.getUser(String(friendId));
            if (toSendUser !== undefined) {
                request.ioSocket?.to(toSendUser.socketId).emit('confirmFriendship', {
                    notifications: foundReceiver?.notifications,
                    userFriends: foundSender[0].foundFriend[0],
                });
            }
        }
        response.status(200).json({
            receiverFriendId: foundReceiver?.friends[0].friend,
            receiverFriends: foundReceiver?.friends[0],
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.confirmFriendshipController = confirmFriendshipController;
