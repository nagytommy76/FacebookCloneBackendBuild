"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("../../../models/posts/posts");
class GetCommentController {
    getCommentsController = async (req, res) => {
        const postId = req.query.postId;
        try {
            const foundComments = await posts_1.Posts.findOne({ _id: postId })
                .selectAndPopulateUserPicure('comments', 'comments.userId')
                .selectAndPopulateUserPicure('comments', 'comments.commentAnswers.userId')
                .lean();
            res.status(200).json({ comments: foundComments.comments });
        }
        catch (error) {
            res.status(500).json(error);
        }
    };
}
exports.default = GetCommentController;
