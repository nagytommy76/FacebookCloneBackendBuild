"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const posts_1 = require("../posts/posts");
const ChatSchema = new mongoose_1.Schema({
    participants: { type: [{ participant: { type: mongoose_1.Types.ObjectId, ref: 'User' } }] },
    messages: [
        {
            createdAt: { type: Date, default: new Date() },
            updatedAt: { type: Date, default: new Date() },
            isRead: { type: Boolean, default: false },
            receiverUserId: { type: mongoose_1.Types.ObjectId, ref: 'User' },
            message: { type: String },
            image: { type: String, default: '' },
            reaction: posts_1.likesSchemaObject,
        },
    ],
}, { timestamps: true });
exports.ChatModel = (0, mongoose_1.model)('Chat', ChatSchema);
