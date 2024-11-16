"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basePost_1 = __importDefault(require("./Base/basePost"));
class GetPostsController extends basePost_1.default {
    getAllPosts = async (req, res) => {
        try {
            const allPosts = await this.returnPostModelWithPopulated();
            res.status(200).json({ allPosts });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error, msg: 'internal server error' });
        }
    };
    // Ebben az esetben nem a token-ből jön a userId hanem a query (params) ból
    getUsersAllPosts = async (req, res) => {
        const userId = req.query.userId;
        if (!userId)
            return res.status(404).json({ msg: 'User not found' });
        try {
            const allUsersPosts = await this.returnPostModelWithPopulated(userId);
            res.status(200).json({ allPosts: allUsersPosts });
        }
        catch (error) {
            res.status(500).json(error);
        }
    };
}
exports.default = GetPostsController;
