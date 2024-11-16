"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostController = void 0;
const posts_1 = require("../../models/posts/posts");
const updatePostController = async (request, response) => {
    const userId = request.user.userId;
    const { postId, modifiedImageLinks, newAddedImageLinks, postDescription } = request.body;
    try {
        let mergedImages = [];
        if (modifiedImageLinks !== null) {
            mergedImages = mergedImages.concat(modifiedImageLinks);
        }
        if (newAddedImageLinks !== null) {
            mergedImages = mergedImages.concat(newAddedImageLinks);
        }
        if (newAddedImageLinks === null && modifiedImageLinks === null) {
            mergedImages = null;
        }
        const foundPost = await posts_1.Posts.updateOne({ _id: postId, userId: userId }, [
            { $set: { description: postDescription } },
            { $set: { postedPicturesPath: mergedImages } },
        ]);
        response.status(200).json({ newImagesLinks: mergedImages });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error });
    }
};
exports.updatePostController = updatePostController;
