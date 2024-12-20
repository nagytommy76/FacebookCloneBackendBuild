"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCommentAnswerController = exports.removeCommentController = void 0;
const posts_1 = require("../../models/posts/posts");
const removeCommentController = async (request, response) => {
    const { postId, commentId } = request.body;
    const currentUserId = request.user?.userId;
    try {
        // ha egy "fő" komment:
        const foundPostsComment = await posts_1.Posts.find({
            _id: postId,
            comments: { $elemMatch: { _id: commentId, userId: currentUserId } },
        }).select('comments');
        foundPostsComment[0].comments = foundPostsComment[0].comments.filter((comment) => comment._id?.toString() != commentId.toString());
        foundPostsComment[0].save();
        response.status(200).json({ msg: 'success', commentsLength: foundPostsComment[0].comments.length });
    }
    catch (error) {
        response.status(500).json({ error, msg: 'internal server error' });
    }
};
exports.removeCommentController = removeCommentController;
const removeCommentAnswerController = async (request, response) => {
    const { postId, answerId } = request.body;
    try {
        const foundPostsComment = await posts_1.Posts.find({
            _id: postId,
            'comments.commentAnswers': { $elemMatch: { _id: answerId } },
        }).select(['comments.commentAnswers.$']);
        const foundAnswerToDelete = foundPostsComment[0].comments[0].commentAnswers?.find((answer) => answer._id == answerId);
        // Azokat kell kitörölni amelyeknek a parentCommentId-je megegyezik
        // fel kell építeni egy comment fát, megviszgálni hogy van-e utána "CHILD" comment még és azoknak id-jét kigyüjteni
        let foundChilds = [];
        const test = foundPostsComment[0].comments[0].commentAnswers.map((answer) => {
            let firstParentId = foundAnswerToDelete._id;
            // Ezzel megkeresem az összes 1-gyel lejjebb lévő commentet -> most kéne lejjebb menni.
            if (answer.parentCommentId == firstParentId &&
                foundAnswerToDelete.commentDepth < answer.commentDepth) {
                firstParentId = answer._id;
                console.log(firstParentId);
                console.log('');
                console.log(answer.parentCommentId);
            }
        });
        foundPostsComment[0].comments[0].commentAnswers =
            foundPostsComment[0].comments[0].commentAnswers?.filter((answer) => {
                return (answer.commentDepth <= foundAnswerToDelete?.commentDepth &&
                    answer._id != answerId &&
                    answer.parentCommentId != answerId);
            });
        // A commentDepth + 1 et vizsgálnom kell, hogy a parentComentId-je az megegyezik-e a törlendővel,
        // Ha igen azt is törölnöm kell
        response.status(200).json({
            msg: 'helló VÁLASZ TÖRLÉS',
            newCommentAnswers: foundPostsComment[0].comments[0].commentAnswers,
            foundAnswerToDelete,
        });
    }
    catch (error) {
        response.status(500).json({ error, msg: 'internal server error' });
    }
};
exports.removeCommentAnswerController = removeCommentAnswerController;
