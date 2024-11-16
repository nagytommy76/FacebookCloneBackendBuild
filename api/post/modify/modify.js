"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accessTokenRefresh_1 = require("../../../middlewares/accessTokenRefresh");
const updateComment_1 = require("../../../controllers/posts/updateComment");
const updatePost_1 = require("../../../controllers/posts/updatePost");
class ModifyPostApi {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        // POSZT
        this.router.put('/update-post', accessTokenRefresh_1.authenticateAccessTokenForApi, updatePost_1.updatePostController);
        // Módosítás - KOMMENT
        this.router.put('/update-post-comment', accessTokenRefresh_1.authenticateAccessTokenForApi, updateComment_1.updateCommentController);
        this.router.put('/update-post-comment-answer', accessTokenRefresh_1.authenticateAccessTokenForApi, updateComment_1.updateCommentAnswerController);
    }
}
exports.default = ModifyPostApi;
