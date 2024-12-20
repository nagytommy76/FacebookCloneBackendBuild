"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMessagesRead = exports.saveChatMessageController = void 0;
const chatModel_1 = require("../../models/chat/chatModel");
const saveChatMessageController = async (request, response) => {
    const { chatId, chatMsg, chatImagePath, selectedChatWithUserId } = request.body;
    try {
        const foundChat = await chatModel_1.ChatModel.findOne({
            _id: chatId,
        });
        if (!foundChat)
            return response.status(404).json({ msg: 'ChatModel not found' });
        foundChat.messages.push({
            createdAt: new Date(),
            updatedAt: new Date(),
            message: chatMsg,
            receiverUserId: selectedChatWithUserId,
            image: chatImagePath,
            reaction: [],
        });
        await foundChat.save();
        response.status(200).json({
            message: chatMsg,
            addedMessages: foundChat.messages[foundChat.messages.length - 1],
            foundChatId: foundChat._id,
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.saveChatMessageController = saveChatMessageController;
const setMessagesRead = async (request, response) => {
    const loggedInUserId = request.user?.userId;
    const { currentChatId } = request.body;
    try {
        const foundUsersMessages = await chatModel_1.ChatModel.findOne({
            _id: currentChatId,
        }).select('messages');
        if (!foundUsersMessages)
            return response.status(404).json({ msg: 'Chat not found' });
        foundUsersMessages.messages = foundUsersMessages.messages.map((message) => {
            if (message.receiverUserId == loggedInUserId) {
                message.isRead = true;
            }
            return message;
        });
        await foundUsersMessages.save();
        response.status(200).json({ totalUnreadMsgCount: 0 });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.setMessagesRead = setMessagesRead;
