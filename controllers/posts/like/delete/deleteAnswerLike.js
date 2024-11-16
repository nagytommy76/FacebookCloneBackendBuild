"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLikeController_1 = __importDefault(require("../../../Base/BaseLikeController"));
const posts_1 = require("../../../../models/posts/posts");
class DeleteAnswerLike extends BaseLikeController_1.default {
    deleteLikeAnswerController = async (request, response) => {
        const { answerId, commentId, postId, likeIdToDelete } = request.body;
        const userId = request.user?.userId;
        try {
            const found = await posts_1.Posts.updateOne({
                _id: postId,
                comments: {
                    $elemMatch: {
                        _id: commentId,
                        'commentAnswers._id': answerId,
                        'commentAnswers.likes._id': likeIdToDelete,
                    },
                },
            }, {
                $pull: {
                    'comments.$[outer].commentAnswers.$[inner].likes': { _id: likeIdToDelete, userId },
                },
            }, {
                arrayFilters: [{ 'outer._id': commentId }, { 'inner._id': answerId }],
                upsert: true,
            });
            response.status(200).json({ msg: 'Törlés', found });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ error });
        }
    };
}
exports.default = DeleteAnswerLike;
