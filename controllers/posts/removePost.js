"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("../../models/posts/posts");
const basePost_1 = __importDefault(require("./Base/basePost"));
class RemovePostsController extends basePost_1.default {
    removePostController = async (request, response) => {
        const postId = request.body.postId;
        const currentUserId = request.user?.userId;
        try {
            const result = await posts_1.Posts.deleteOne({ _id: postId, userId: currentUserId });
            response.status(200).json({ result });
        }
        catch (error) {
            console.log(error);
            response.status(500).json(error);
        }
    };
}
exports.default = RemovePostsController;
