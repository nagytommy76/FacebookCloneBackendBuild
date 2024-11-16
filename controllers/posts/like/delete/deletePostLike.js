"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("../../../../models/posts/posts");
const BaseLikeController_1 = __importDefault(require("../../../Base/BaseLikeController"));
class DeleteLikePost extends BaseLikeController_1.default {
    deleteLikeFromPostController = async (request, response) => {
        const { postId } = request.body;
        const userId = request.user?.userId;
        try {
            const foundPost = await posts_1.Posts.findById(postId);
            if (!foundPost)
                return response.status(404).json({ msg: 'nincs ilyen poszt' });
            const { filteredLikes, removedUserLikesID } = this.getFilteredLikesByUserId(foundPost.likes, userId);
            foundPost.likes = filteredLikes;
            await foundPost.save();
            if (request.getUser !== undefined) {
                const toSendUser = request.getUser(foundPost.userId.toString());
                if (toSendUser !== undefined) {
                    request.ioSocket?.to(toSendUser.socketId).emit('dislikedPost', [
                        {
                            likeType: foundPost.likes,
                            postData: {
                                _id: foundPost._id,
                                description: foundPost.description,
                            },
                        },
                    ]);
                }
            }
            response.status(200).json({ removedUserLikesID, filteredLikes });
        }
        catch (error) {
            console.log(error);
            response.status(500).json({ msg: 'Internal server error' });
        }
    };
}
exports.default = DeleteLikePost;
