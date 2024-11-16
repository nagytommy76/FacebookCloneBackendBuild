"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLikeController_1 = __importDefault(require("../../../Base/BaseLikeController"));
const posts_1 = require("../../../../models/posts/posts");
class DeleteCommentLike extends BaseLikeController_1.default {
    deleteLikeCommentController = async (request, response) => {
        const { commentId, postId, likeIdToDelete } = request.body;
        const userId = request.user?.userId;
        try {
            const found = await posts_1.Posts.updateOne({
                _id: postId,
                comments: {
                    $elemMatch: { _id: commentId, 'likes._id': likeIdToDelete, 'likes.userId': userId },
                },
            }, {
                $pull: {
                    'comments.$[outer].likes': { _id: likeIdToDelete, userId },
                },
            }, {
                arrayFilters: [{ 'outer._id': commentId }],
                upsert: true,
            });
            response.status(200).json({ found });
        }
        catch (error) {
            response.status(500).json(error);
        }
    };
}
exports.default = DeleteCommentLike;
