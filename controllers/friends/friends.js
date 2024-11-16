"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFriendshipController = void 0;
const user_1 = require("../../models/user/user");
const makeFriendshipController = async (request, response) => {
    const loggedInUserId = request.user?.userId;
    const friendId = request.body.friendId;
    try {
        const senderUser = await user_1.User.findOne({
            _id: loggedInUserId,
            'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
        }).select(['friends', 'firstName', 'sureName', 'notifications', 'userDetails.profilePicturePath.$']);
        const receiverUser = await user_1.User.findOne({ _id: friendId }).select([
            'friends',
            'firstName',
            'sureName',
            'notifications',
        ]);
        if (!senderUser)
            return response.status(404).json({ msg: 'Sender user not found' });
        if (!receiverUser)
            return response.status(404).json({ msg: 'Receiver user not found' });
        receiverUser.friends.push({ friend: senderUser._id, isSender: true });
        senderUser.friends.push({ friend: receiverUser._id });
        receiverUser.notifications.push({
            createdAt: new Date(),
            isRead: false,
            notificationType: 'isFriend',
            userDetails: {
                firstName: senderUser.firstName,
                sureName: senderUser.sureName,
                userId: senderUser._id,
                profilePicture: senderUser.userDetails.profilePicturePath[0].path,
            },
        });
        await receiverUser.save();
        await senderUser.save();
        if (request.getUserById !== undefined) {
            const toSendUser = await request.getUserById(friendId);
            if (toSendUser !== undefined) {
                request.ioSocket?.to(toSendUser[friendId].socketId).emit('makeFriendship', {
                    notifications: receiverUser.notifications,
                    userFriends: {
                        _id: senderUser._id,
                        friends: senderUser.friends,
                    },
                });
            }
        }
        response.status(200).json({
            receiverUser,
        });
    }
    catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            console.error('Friendship already exists:', error);
            // You can choose to throw a custom error, retry, or handle it differently
        }
        console.log(error);
        response.status(500).json(error);
    }
};
exports.makeFriendshipController = makeFriendshipController;
