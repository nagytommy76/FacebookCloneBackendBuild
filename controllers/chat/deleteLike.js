"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatModel_1 = require("../../models/chat/chatModel");
const BaseLikeController_1 = __importDefault(require("../Base/BaseLikeController"));
class DeleteLikeChatController extends BaseLikeController_1.default {
    deleteLikeController = async (request, response) => {
        const { chatId, messageId, likeIdToDelete } = request.body;
        const userId = request.user?.userId;
        try {
            const updatedReaction = await chatModel_1.ChatModel.updateOne({
                _id: chatId,
                messages: {
                    $elemMatch: { _id: messageId, 'reaction._id': likeIdToDelete, 'reaction.userId': userId },
                },
            }, {
                $pull: {
                    'messages.$[outer].reaction': { _id: likeIdToDelete, userId },
                },
            }, {
                arrayFilters: [{ 'outer._id': messageId }],
                upsert: true,
            });
            const modifiedMessage = await chatModel_1.ChatModel.findOne({
                _id: chatId,
                messages: { $elemMatch: { _id: messageId } },
            }).select('messages.$');
            response.status(200).json({ modifiedMessage: modifiedMessage?.messages[0] });
        }
        catch (error) {
            response.status(500).json(error);
        }
    };
}
exports.default = DeleteLikeChatController;
