"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMessageLabels = exports.aggregateMessageLabels = void 0;
const mongoose_1 = require("mongoose");
const chatModel_1 = require("../../models/chat/chatModel");
const projectUserData = () => {
    return {
        firstName: 1,
        sureName: 1,
        selectedProfilePicture: {
            $filter: {
                input: '$userDetails.profilePicturePath',
                as: 'profilePic',
                cond: { $eq: ['$$profilePic.isSelected', true] },
            },
        },
    };
};
const lookupUser = (as, pipeline) => {
    return {
        from: 'users',
        localField: 'participants.participant',
        foreignField: '_id',
        as,
        pipeline,
    };
};
const aggregateMessageLabels = async (loggedInUserId, chatId) => {
    const foundChat = await chatModel_1.ChatModel.aggregate([
        {
            $match: {
                'participants.participant': loggedInUserId,
            },
        },
        {
            $lookup: lookupUser('populatedParticipants', [
                {
                    $project: projectUserData(),
                },
            ]),
        },
        {
            $lookup: lookupUser('chatWithParticipant', [
                {
                    $match: {
                        _id: { $ne: loggedInUserId },
                    },
                },
                {
                    $project: projectUserData(),
                },
            ]),
        },
        {
            $addFields: {
                totalUnreadMsgCount: {
                    $sum: {
                        $size: {
                            $filter: {
                                input: '$messages',
                                as: 'message',
                                cond: {
                                    $and: [
                                        { $eq: ['$$message.isRead', false] },
                                        { $eq: ['$$message.receiverUserId', loggedInUserId] },
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $unwind: {
                path: '$chatWithParticipant',
            },
        },
    ]);
    return foundChat;
};
exports.aggregateMessageLabels = aggregateMessageLabels;
const getChatMessageLabels = async (request, response) => {
    const loggedInUserId = new mongoose_1.Types.ObjectId(request.user?.userId);
    try {
        const foundChat = await (0, exports.aggregateMessageLabels)(loggedInUserId);
        response.status(200).json({ foundChat });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.getChatMessageLabels = getChatMessageLabels;
