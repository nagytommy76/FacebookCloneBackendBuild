"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accessTokenRefresh_1 = require("../../middlewares/accessTokenRefresh");
const chat_1 = require("../../controllers/chat/chat");
const chatMessages_1 = require("../../controllers/chat/chatMessages");
const getChats_1 = require("../../controllers/chat/getChats");
const removeMessage_1 = require("../../controllers/chat/removeMessage");
const deleteChat_1 = require("../../controllers/chat/deleteChat");
const likeMessage_1 = __importDefault(require("../../controllers/chat/likeMessage"));
const deleteLike_1 = __importDefault(require("../../controllers/chat/deleteLike"));
const LikeController = new likeMessage_1.default();
const DeleteController = new deleteLike_1.default();
class ChatApi {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.get('/get-all-chats', accessTokenRefresh_1.authenticateAccessTokenForApi, getChats_1.getChatMessageLabels);
        this.router.get('/get-message-like-count', accessTokenRefresh_1.authenticateAccessTokenForApi, LikeController.getMsgReactionByTypeAndCountController);
        this.router.post('/add-chat-msg', accessTokenRefresh_1.authenticateAccessTokenForApi, chatMessages_1.saveChatMessageController);
        this.router.post('/create-chat', accessTokenRefresh_1.authenticateAccessTokenForApi, chat_1.createNewChatController);
        // Like
        this.router.post('/like-message', accessTokenRefresh_1.authenticateAccessTokenForApi, LikeController.likeMessageController);
        this.router.put('/set-read-messages', accessTokenRefresh_1.authenticateAccessTokenForApi, chatMessages_1.setMessagesRead);
        this.router.patch('/delete-message', accessTokenRefresh_1.authenticateAccessTokenForApi, removeMessage_1.deleteMessageController);
        this.router.delete('/delete-message-like', accessTokenRefresh_1.authenticateAccessTokenForApi, DeleteController.deleteLikeController);
        this.router.delete('/delete-chat', accessTokenRefresh_1.authenticateAccessTokenForApi, deleteChat_1.deleteChatController);
    }
}
exports.default = ChatApi;
