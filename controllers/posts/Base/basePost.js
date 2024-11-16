"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = require("../../../models/posts/posts");
const BaseLikeController_1 = __importDefault(require("../../Base/BaseLikeController"));
class BasePostController extends BaseLikeController_1.default {
    async returnPostModelWithPopulated(userId = null) {
        const allPosts = await posts_1.Posts.find(userId ? { userId } : {})
            // Ezt egyelőre: Meg tudjam számolni a commenteket, később egy lekérdezésben
            .select([
            '-comments.answeredAt',
            '-comments.comment',
            '-comments.commentAnswers',
            '-comments.commentImage',
            '-comments.likes',
            '-comments.userId',
        ])
            .populateUserIdWithProfilePicture('userId')
            .lean();
        return allPosts;
    }
}
exports.default = BasePostController;
