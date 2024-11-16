"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessageController = void 0;
const chatModel_1 = require("../../models/chat/chatModel");
const deleteMessageController = async (request, response) => {
    const { chatId, messageId } = request.body;
    try {
        const foundMessages = await chatModel_1.ChatModel.findOne({
            _id: chatId,
        }).select('messages');
        if (!foundMessages)
            return response.status(404).json({ msg: 'Chat not found' });
        foundMessages.messages = foundMessages.messages.filter((message) => message._id != messageId);
        await foundMessages.save();
        response.status(200).json({ msg: 'Message Deleted', updatedMessages: foundMessages.messages });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.deleteMessageController = deleteMessageController;
