"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePostImageController = exports.savePostController = void 0;
const express_1 = require("express");
const posts_1 = require("../../models/posts/posts");
/**
 * a userId az accessToken decoded fog jönni
 */
const savePostController = async (req, res) => {
    const { description, createdAt } = req.body;
    const userId = req.user?.userId;
    if (!userId)
        return express_1.response.status(404).json({ msg: 'User not found' });
    try {
        const createdPost = await posts_1.Posts.create({
            userId: userId,
            createdAt,
            description,
        });
        await createdPost.populateUserId();
        res.status(201).json({ createdPost });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
exports.savePostController = savePostController;
const savePostImageController = async (req, res) => {
    const { postId, postedPicturesPath } = req.body;
    const userId = req.user?.userId;
    if (!userId)
        return express_1.response.status(404).json({ msg: 'User not found' });
    try {
        await posts_1.Posts.updateOne({ _id: postId, userId }, [{ $set: { postedPicturesPath } }]);
        res.status(201).json({ msg: 'success' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.savePostImageController = savePostImageController;
