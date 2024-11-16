"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewChatController = void 0;
const chatModel_1 = require("../../models/chat/chatModel");
const mongoose_1 = require("mongoose");
const getChats_1 = require("./getChats");
const createNewChatController = async (request, response) => {
    const chatUserId = request.body.chatUserId;
    const loggedInUserId = request.user?.userId;
    try {
        const foundChat = await chatModel_1.ChatModel.findOne({
            $and: [{ 'participants.participant': chatUserId }, { 'participants.participant': loggedInUserId }],
        }).select('_id');
        if (foundChat === null) {
            const createdChatModel = await chatModel_1.ChatModel.create({
                participants: [{ participant: chatUserId }, { participant: loggedInUserId }],
                messages: [],
            });
            const aggregatedChatLabels = await (0, getChats_1.aggregateMessageLabels)(new mongoose_1.Types.ObjectId(loggedInUserId), new mongoose_1.Types.ObjectId(createdChatModel._id));
            aggregatedChatLabels[0].totalUnreadMsgCount = 1;
            return response.status(201).json({ createdChatModel: aggregatedChatLabels[0] });
        }
        else {
            return response.status(200).json({ createdChatModel: foundChat, msg: 'Chat already exist' });
        }
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.createNewChatController = createNewChatController;
