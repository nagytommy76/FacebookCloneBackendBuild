"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("../../../models/posts/posts");
const user_1 = require("../../../models/user/user");
const basePost_1 = __importDefault(require("../Base/basePost"));
class LikePost extends basePost_1.default {
    getPostLikesByTypeAndCountController = async (request, response) => {
        const { postId } = request.body;
        try {
            const postLikes = await posts_1.Posts.findById(postId).selectAndPopulateUserPicure('likes', 'likes.userId');
            if (!postLikes)
                return response.status(404).json({ msg: 'post not found' });
            const reactionTypes = this.getLikesByReactionType(postLikes.likes);
            const totalReactionCount = this.countLikeReactions(reactionTypes);
            return response.status(200).json({ reactionTypes, totalReactionCount });
        }
        catch (error) {
            response.status(500).json({ msg: 'Internal server error', error });
        }
    };
    getPostCommentsLikesByTypeAndCountController = async (request, response) => {
        const { commentId, postId } = request.body;
        try {
            const postCommentLikes = await posts_1.Posts.findOne({
                _id: postId,
                comments: { $elemMatch: { _id: commentId } },
            }).selectAndPopulateUserPicure('comments.$', 'comments.likes.userId');
            if (!postCommentLikes)
                return response.status(404).json({ msg: 'post not found' });
            const reactionTypes = this.getLikesByReactionType(postCommentLikes.comments[0].likes);
            const totalReactionCount = this.countLikeReactions(reactionTypes);
            response.status(200).json({ reactionTypes, totalReactionCount });
        }
        catch (error) {
            response.status(500).json({ msg: 'Internal server error', error });
        }
    };
    getPostCommentAnswersLikesByTypeAndCountController = async (request, response) => {
        const { postId, answerId, commentId } = request.body;
        try {
            const postCommentAnswerLikes = await posts_1.Posts.findOne({
                _id: postId,
                comments: { $elemMatch: { _id: commentId, 'commentAnswers._id': answerId } },
            }).selectAndPopulateUserPicure('comments.commentAnswers.$', 'comments.commentAnswers.likes.userId');
            if (!postCommentAnswerLikes)
                return response.status(404).json({ msg: 'post not found' });
            const foundCommentAnswer = postCommentAnswerLikes.comments[0].commentAnswers.find((answer) => {
                return answer._id == answerId;
            });
            if (!foundCommentAnswer)
                return response.status(404).json({ msg: 'commentAnswer not found' });
            const reactionTypes = this.getLikesByReactionType(foundCommentAnswer.likes);
            const totalReactionCount = this.countLikeReactions(reactionTypes);
            response.status(200).json({ reactionTypes, totalReactionCount });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ msg: 'Internal server error', error });
        }
    };
    likePostController = async (request, response) => {
        const { postId, reactionType } = request.body;
        const userId = request.user?.userId;
        try {
            const foundPostToModifyLike = await posts_1.Posts.findById(postId);
            if (!foundPostToModifyLike)
                return response.status(404).json({ msg: 'nincs ilyen poszt' });
            const userLike = this.findUsersLikeByUserID(foundPostToModifyLike.likes, userId);
            this.checkUserLike(userLike, reactionType, foundPostToModifyLike.likes, userId);
            await foundPostToModifyLike.save();
            // Who liked your post
            const likedUser = await user_1.User.getUserByUserIdAndSelect(userId);
            // SAVE TO DB --------------------------------
            let toSaveNotification;
            if (foundPostToModifyLike.userId.toString() != userId) {
                toSaveNotification = await user_1.User.getSaveNotification(foundPostToModifyLike._id, foundPostToModifyLike.userId, foundPostToModifyLike.description, likedUser[0].firstName, likedUser[0].sureName, likedUser[0]._id, likedUser[0].selectedProfilePicturePath[0].path, 'isPostLike');
            }
            // SOCKET ---------------------------
            if (request.getUser !== undefined) {
                const toSendUser = request.getUser(foundPostToModifyLike.userId.toString());
                if (toSendUser !== undefined && toSendUser.userId != userId) {
                    request.ioSocket?.to(toSendUser.socketId).emit('likedPost', {
                        notifications: toSaveNotification?.notifications,
                        likeType: foundPostToModifyLike.likes,
                        toModifyPostId: foundPostToModifyLike.id,
                    });
                }
            }
            response.status(200).json(foundPostToModifyLike.likes);
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ msg: 'Internal server error', error });
        }
    };
}
exports.default = LikePost;
