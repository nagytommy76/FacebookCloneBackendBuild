"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Posts = exports.likesSchemaObject = void 0;
const mongoose_1 = require("mongoose");
exports.likesSchemaObject = {
    type: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            reactionType: {
                isLike: { type: Boolean, default: false },
                isLove: { type: Boolean, default: false },
                isCare: { type: Boolean, default: false },
                isHaha: { type: Boolean, default: false },
                isWow: { type: Boolean, default: false },
                isSad: { type: Boolean, default: false },
                isAngry: { type: Boolean, default: false },
            },
        },
    ],
    required: false,
};
const commentAnswers = {
    type: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            comment: { type: String, required: true },
            parentCommentId: { type: String, required: false, default: null },
            commentDepth: { type: Number, required: true, default: 1 },
            answeredAt: { type: Date, required: false, default: new Date() },
            commentImage: { type: String, required: false, default: null },
            likes: exports.likesSchemaObject,
        },
    ],
    required: false,
};
const PostsSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    description: String,
    postedPicturesPath: { type: [String], required: false },
    likes: exports.likesSchemaObject,
    comments: {
        type: [
            {
                userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
                comment: { type: String, required: true },
                answeredAt: { type: Date, required: false, default: new Date() },
                commentImage: { type: String, required: false, default: null },
                commentAnswers,
                likes: exports.likesSchemaObject,
            },
        ],
        required: false,
    },
}, {
    query: {
        selectAndPopulateUserPicure(selectField, path, selectArray = []) {
            return this.select(selectField).populate({
                path: path,
                select: ['_id', 'firstName', 'sureName', 'userDetails.profilePicturePath.$'].concat(selectArray),
                match: {
                    'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
                },
            });
        },
        /**
         * Populates the user ID field with the profile picture path, optionally selecting additional fields.
         *
         * @param {string} [path='userId'] - The path to the user ID field.
         * @param {string[]} [selectArray=[]] - An optional array of fields to select.
         * @return {Query<IPostTypes, PostModel>} - The query object with the populated fields.
         */
        populateUserIdWithProfilePicture(path = 'userId', selectArray = []) {
            return this.populate({
                path,
                select: ['email', '_id', 'sureName', 'firstName', 'userDetails.profilePicturePath.$'].concat(selectArray),
                match: {
                    'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
                },
            });
        },
    },
    timestamps: true,
});
PostsSchema.methods.populateUserId = async function () {
    return this.populate({
        path: 'userId',
        select: ['email', '_id', 'sureName', 'firstName', 'userDetails.profilePicturePath.$'],
        match: {
            'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
        },
    });
};
PostsSchema.methods.populateCommentUserId = async function () {
    return this.populate({
        path: 'comments.userId',
        select: ['firstName', 'sureName', 'userDetails.profilePicturePath.$'],
        match: {
            'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
        },
    });
};
PostsSchema.methods.populateCommentAnswerUserId = async function () {
    return this.populate({
        path: 'comments.commentAnswers.userId',
        select: ['firstName', 'sureName', 'userDetails.profilePicturePath.$'],
        match: {
            'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
        },
    });
};
exports.Posts = (0, mongoose_1.model)('Posts', PostsSchema);
