"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatModel_1 = require("../../models/chat/chatModel");
const BaseLikeController_1 = __importDefault(require("../Base/BaseLikeController"));
class LikeChatController extends BaseLikeController_1.default {
    likeMessageController = async (request, response) => {
        const { likeType, messageId, chatId } = request.body;
        const userId = request.user?.userId;
        try {
            const foundSingleMessage = await chatModel_1.ChatModel.findOne({
                _id: chatId,
            }).select(['messages']);
            if (!foundSingleMessage)
                return response.status(404).json({ msg: 'Messages not found' });
            const foundMessageIndex = foundSingleMessage.messages.findIndex((message) => message._id == messageId);
            const userHasLike = this.findUsersLikeByUserID(foundSingleMessage.messages[foundMessageIndex].reaction, userId);
            this.checkUserLike(userHasLike, likeType, foundSingleMessage.messages[foundMessageIndex].reaction, userId);
            await foundSingleMessage.save();
            response.status(200).json({
                modifiedReaction: foundSingleMessage.messages[foundMessageIndex].reaction,
                foundMessageIndex,
            });
        }
        catch (error) {
            console.log(error);
            response.status(500).json(error);
        }
    };
    getMsgReactionByTypeAndCountController = async (request, response) => {
        const { messageId, chatId } = request.query;
        try {
            const foundMessage = await chatModel_1.ChatModel.findOne({
                _id: chatId,
                messages: { $elemMatch: { _id: messageId } },
            })
                .select(['messages.$'])
                .populate({
                path: 'messages.reaction.userId',
                select: ['firstName', 'sureName', 'userDetails.profilePicturePath.$'],
                match: {
                    'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
                },
            });
            if (!foundMessage)
                return response.status(404).json({ msg: 'message not found' });
            const reactionTypes = this.getLikesByReactionType(foundMessage.messages[0].reaction);
            const totalReactionCount = this.countLikeReactions(reactionTypes);
            response.status(200).json({ reactionTypes, totalReactionCount });
        }
        catch (error) {
            console.log(error);
            response.status(500).json(error);
        }
    };
}
exports.default = LikeChatController;
