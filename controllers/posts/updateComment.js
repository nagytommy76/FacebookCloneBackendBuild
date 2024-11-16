"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentAnswerController = exports.updateCommentController = void 0;
const posts_1 = require("../../models/posts/posts");
const updateCommentController = async (request, response) => {
    const { commentId, modifiedText, postId, commentImage } = request.body;
    try {
        // return response.status(500).json({ modifiedComment: modifiedText, uploadedImageLink: commentImage })
        const foundPostComment = await posts_1.Posts.updateOne({
            _id: postId,
            comments: { $elemMatch: { _id: commentId } },
        }, {
            $set: {
                'comments.$.comment': modifiedText,
                'comments.$.commentImage': commentImage,
            },
        });
        response
            .status(201)
            .json({ modifiedComment: modifiedText, uploadedImageLink: commentImage, foundPostComment });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ msg: 'internal server error', error });
    }
};
exports.updateCommentController = updateCommentController;
const updateCommentAnswerController = async (request, response) => {
    const { commentAnswerId, commentId, commentImage, modifiedText, postId } = request.body;
    try {
        const found = await posts_1.Posts.updateOne({
            _id: postId,
            comments: { $elemMatch: { _id: commentId, 'commentAnswers._id': commentAnswerId } },
        }, {
            $set: {
                'comments.$[outer].commentAnswers.$[inner].comment': modifiedText,
                'comments.$[outer].commentAnswers.$[inner].commentImage': commentImage,
            },
        }, {
            arrayFilters: [{ 'outer._id': commentId }, { 'inner._id': commentAnswerId }],
            upsert: true,
        });
        response.status(201).json({ modifiedComment: modifiedText, uploadedImageLink: commentImage });
    }
    catch (error) {
        response.status(500).json({ msg: 'internal server error', error });
    }
};
exports.updateCommentAnswerController = updateCommentAnswerController;
/**
 *    https://dev.to/rajeshroyal/update-an-object-in-nested-array-in-mongodb-o5a
 *    https://www.mongodb.com/docs/v6.2/reference/method/db.collection.updateOne/#examples
 *
 */
