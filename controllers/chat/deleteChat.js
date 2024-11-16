"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatController = void 0;
const chatModel_1 = require("../../models/chat/chatModel");
const deleteChatController = async (request, response) => {
    const { chatId } = request.body;
    try {
        const deletedChat = await chatModel_1.ChatModel.deleteOne({ _id: chatId });
        response.status(200).json({ deletedChat });
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
exports.deleteChatController = deleteChatController;
