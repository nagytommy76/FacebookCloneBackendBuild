"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePostComment = void 0;
const posts_1 = require("../../models/posts/posts");
const user_1 = require("../../models/user/user");
const basePost_1 = __importDefault(require("./Base/basePost"));
const redis_config_1 = __importDefault(require("../../config/redis.config"));
class PostCommentController extends basePost_1.default {
    answerToCommentController = async (request, response) => {
        const userId = request.user?.userId;
        if (!userId)
            return response.status(404).json({ msg: 'User not found' });
        const { answeredAt, commentAnswer, postId, commentId, parentCommentId, commentDepth, commentImage } = request.body;
        try {
            const foundPostComment = await posts_1.Posts.findById(postId);
            if (!foundPostComment)
                return response.status(404).json({ msg: `post not found by id: ${postId}` });
            const foundCommentIndex = foundPostComment.comments.findIndex((comment) => comment._id == commentId);
            foundPostComment.comments[foundCommentIndex].commentAnswers.push({
                answeredAt,
                comment: commentAnswer,
                commentDepth,
                commentImage,
                parentCommentId,
                likes: [],
                userId,
            });
            await foundPostComment.save();
            await foundPostComment.populate({
                path: 'comments.commentAnswers.userId',
                select: ['firstName', 'sureName', 'userDetails.profilePicturePath.$'],
                match: {
                    'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
                },
            });
            response
                .status(200)
                .json({ createdCommentAnswer: foundPostComment.comments[foundCommentIndex].commentAnswers });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ error });
        }
    };
}
exports.default = PostCommentController;
const savePostComment = async (request, response, io) => {
    const userId = request.user?.userId;
    const { comment, commentImage, postId, answeredAt } = request.body;
    if (!userId)
        return response.status(404).json({ msg: 'User not found' });
    try {
        const foundPost = await posts_1.Posts.findById(postId);
        if (!foundPost)
            return response.status(404).json({ msg: 'Post not found' });
        foundPost.comments.push({
            comment,
            userId,
            parentCommentId: null,
            commentDepth: 1,
            likes: [],
            answeredAt,
            commentImage,
            commentAnswers: [],
        });
        await foundPost.save();
        await foundPost.populateCommentUserId();
        await foundPost.populateCommentAnswerUserId();
        // Who liked your post
        const likedUser = await user_1.User.getUserByUserIdAndSelect(userId);
        const toSaveUsersNotification = await user_1.User.getSaveNotification(foundPost._id, foundPost.userId, comment, likedUser[0].firstName, likedUser[0].sureName, likedUser[0]._id, likedUser[0].selectedProfilePicturePath[0].path, 'isComment');
        const toSendUser = await redis_config_1.default.getUserById(foundPost.userId.toString());
        io.io.to(toSendUser.socketId).emit('addComment', {
            notifications: toSaveUsersNotification?.notifications,
            newComments: foundPost.comments,
        });
        response.status(200).json({ comments: foundPost.comments });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error });
    }
};
exports.savePostComment = savePostComment;
