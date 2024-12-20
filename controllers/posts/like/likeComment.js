"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basePost_1 = __importDefault(require("../Base/basePost"));
const posts_1 = require("../../../models/posts/posts");
class CommentLikeController extends basePost_1.default {
    likeCommentController = async (request, response) => {
        const { commentId, postId, reactionType } = request.body;
        const userId = request.user?.userId;
        try {
            // https://www.mongodb.com/community/forums/t/how-to-only-get-the-array-nested-subdocuments-with-that-document-id-and-not-having-to-iterate-through-it/100197
            const foundPostToModifyLike = await posts_1.Posts.findById(postId);
            if (!foundPostToModifyLike)
                return response.status(404).json({ msg: 'Post comment not found' });
            const commentLikeIndex = foundPostToModifyLike.comments.findIndex((comment) => {
                return comment._id?.toString() === commentId.toString();
            });
            const userLike = this.findUsersLikeByUserID(foundPostToModifyLike.comments[commentLikeIndex].likes, userId);
            this.checkUserLike(userLike, reactionType, foundPostToModifyLike.comments[commentLikeIndex].likes, userId);
            await foundPostToModifyLike.save();
            response.status(200).json(foundPostToModifyLike.comments[commentLikeIndex].likes);
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ error });
        }
    };
    likeCommentAnswerController = async (request, response) => {
        const { commentId, postId, commentAnswerId, reactionType } = request.body;
        const userId = request.user?.userId;
        try {
            const foundPostToModifyLike = await posts_1.Posts.findOne({
                _id: postId,
            }).select('comments');
            if (!foundPostToModifyLike)
                return response.status(404).json({ msg: 'Post comment not found' });
            const foundCommentIndex = foundPostToModifyLike.comments.findIndex((comment) => {
                return comment._id?.toString() === commentId.toString();
            });
            const commentAnswersLikeIndex = foundPostToModifyLike.comments[foundCommentIndex].commentAnswers.findIndex((commentAnswer) => {
                return commentAnswer._id?.toString() === commentAnswerId.toString();
            });
            const userLike = this.findUsersLikeByUserID(foundPostToModifyLike.comments[foundCommentIndex].commentAnswers[commentAnswersLikeIndex].likes, userId);
            this.checkUserLike(userLike, reactionType, foundPostToModifyLike.comments[foundCommentIndex].commentAnswers[commentAnswersLikeIndex].likes, userId);
            await foundPostToModifyLike.save();
            response.status(200).json({
                commentAnswersIndex: commentAnswersLikeIndex,
                updatedCommentAnswerLikes: foundPostToModifyLike.comments[foundCommentIndex].commentAnswers[commentAnswersLikeIndex]
                    .likes,
            });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ msg: 'internal server error', error });
        }
    };
}
exports.default = CommentLikeController;
// const PostToModifyLike = await PostModel.updateOne(
//    {
//       _id: postId,
//       comments: {
//          $elemMatch: { _id: commentId, 'commentAnswers._id': commentAnswerId },
//       },
//    },
//    {
//       $push: {
//          'comments.$[outer].commentAnswers.$[inner].likes': {
//             userId,
//             reactionType: {
//                isLike: false,
//                isAngry: false,
//                isCare: false,
//                isHaha: false,
//                isLove: false,
//                isSad: false,
//                isWow: false,
//                [reactionType]: true,
//             },
//          },
//       },
//    },
//    {
//       arrayFilters: [{ 'outer._id': commentId }, { 'inner._id': commentAnswerId }],
//    }
// )
// https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#examples
// Ezt így kell megcsinálnom
