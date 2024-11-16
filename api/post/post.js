"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const savePost_1 = require("../../controllers/posts/savePost");
const accessTokenRefresh_1 = require("../../middlewares/accessTokenRefresh");
const postComment_1 = require("../../controllers/posts/postComment");
const removeComment_1 = require("../../controllers/posts/removeComment");
const getComments_1 = __importDefault(require("../../controllers/posts/comment/getComments"));
const postComment_2 = __importDefault(require("../../controllers/posts/postComment"));
const getPosts_1 = __importDefault(require("../../controllers/posts/getPosts"));
const likePost_1 = __importDefault(require("../../controllers/posts/like/likePost"));
const likeComment_1 = __importDefault(require("../../controllers/posts/like/likeComment"));
const deletePostLike_1 = __importDefault(require("../../controllers/posts/like/delete/deletePostLike"));
const deleteCommentLike_1 = __importDefault(require("../../controllers/posts/like/delete/deleteCommentLike"));
const deleteAnswerLike_1 = __importDefault(require("../../controllers/posts/like/delete/deleteAnswerLike"));
const removePost_1 = __importDefault(require("../../controllers/posts/removePost"));
const GetCommentControllerClass = new getComments_1.default();
const LikePostClass = new likePost_1.default();
const CommentLikeControllerClass = new likeComment_1.default();
const PostComment = new postComment_2.default();
const GetPosts = new getPosts_1.default();
const DeleteLike = new deletePostLike_1.default();
const DeleteCommentLikeClass = new deleteCommentLike_1.default();
const DeleteAnswerLikeClass = new deleteAnswerLike_1.default();
const RemovePostsClass = new removePost_1.default();
class PostApi {
    router;
    io;
    constructor(io) {
        this.io = io;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        // Ide kell egy api route protection (accessTokennel, middleware)
        this.router.get('/get-posts', accessTokenRefresh_1.authenticateAccessTokenForApi, GetPosts.getAllPosts);
        this.router.get('/get-user-posts', accessTokenRefresh_1.authenticateAccessTokenForApi, GetPosts.getUsersAllPosts);
        this.router.post('/save-post', accessTokenRefresh_1.authenticateAccessTokenForApi, savePost_1.savePostController);
        this.router.put('/save-post-image', accessTokenRefresh_1.authenticateAccessTokenForApi, savePost_1.savePostImageController);
        // Komment
        this.router.get('/get-post-comments', accessTokenRefresh_1.authenticateAccessTokenForApi, GetCommentControllerClass.getCommentsController);
        this.router.post('/post-comment-add', accessTokenRefresh_1.authenticateAccessTokenForApi, (request, response) => (0, postComment_1.savePostComment)(request, response, this.io));
        this.router.post('/add-comment-answer', accessTokenRefresh_1.authenticateAccessTokenForApi, PostComment.answerToCommentController);
        // Like COUNT ----------------------------------------------------------
        this.router.post('/get-post-like-count', accessTokenRefresh_1.authenticateAccessTokenForApi, LikePostClass.getPostLikesByTypeAndCountController);
        this.router.post('/get-comment-like-count', accessTokenRefresh_1.authenticateAccessTokenForApi, LikePostClass.getPostCommentsLikesByTypeAndCountController);
        this.router.post('/get-answer-like-count', accessTokenRefresh_1.authenticateAccessTokenForApi, LikePostClass.getPostCommentAnswersLikesByTypeAndCountController);
        // Likeolás ----------------------------------------
        this.router.post('/post-like', accessTokenRefresh_1.authenticateAccessTokenForApi, LikePostClass.likePostController);
        this.router.post('/post-comment-like', accessTokenRefresh_1.authenticateAccessTokenForApi, CommentLikeControllerClass.likeCommentController);
        this.router.post('/comment-answer-like', accessTokenRefresh_1.authenticateAccessTokenForApi, CommentLikeControllerClass.likeCommentAnswerController);
        // LIKE TÖRLÉS ----------------------------------
        this.router.delete('/post-delete', accessTokenRefresh_1.authenticateAccessTokenForApi, RemovePostsClass.removePostController);
        this.router.delete('/post-like-delete', accessTokenRefresh_1.authenticateAccessTokenForApi, DeleteLike.deleteLikeFromPostController);
        this.router.delete('/post-comment-like-delete', accessTokenRefresh_1.authenticateAccessTokenForApi, DeleteCommentLikeClass.deleteLikeCommentController);
        this.router.delete('/post-answer-like-delete', accessTokenRefresh_1.authenticateAccessTokenForApi, DeleteAnswerLikeClass.deleteLikeAnswerController);
        // KOMMENT TÖRLÉS -------------------
        this.router.delete('/post-comment-delete', accessTokenRefresh_1.authenticateAccessTokenForApi, removeComment_1.removeCommentController);
        this.router.delete('/post-comment-answer-delete', accessTokenRefresh_1.authenticateAccessTokenForApi, removeComment_1.removeCommentAnswerController);
    }
}
exports.default = PostApi;
