"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseLikeController {
    findPreviousReactionType(reactionType) {
        return Object.keys(reactionType).filter((key) => reactionType[key])[0];
    }
    countLikeReactions(reactionTypes) {
        let totalReactionCount = 0;
        Object.values(reactionTypes).forEach((value) => {
            totalReactionCount += value.count;
        });
        return totalReactionCount;
    }
    findUsersLikeByUserID(likes, userId) {
        return likes.find((like) => like.userId.toString() === userId.toString());
    }
    getLikesByReactionType(likes) {
        const reactionTypes = {};
        try {
            likes.map((like) => {
                Object.entries(like.reactionType).map((keyValue) => {
                    if (like.reactionType[keyValue[0]] === true) {
                        if (reactionTypes[keyValue[0]] === undefined) {
                            reactionTypes[keyValue[0]] = {
                                count: 1,
                                reactors: [like.userId],
                            };
                        }
                        else {
                            reactionTypes[keyValue[0]].count++;
                            // Hozzáadni a usereket
                            reactionTypes[keyValue[0]].reactors.push(like.userId);
                        }
                    }
                });
            });
        }
        catch (error) {
            console.log(error);
        }
        return reactionTypes;
    }
    getFilteredLikesByUserId(likes, userId) {
        let removedUserLikesID = null;
        const filteredLikes = likes.filter((like) => {
            if (like.userId.toString() !== userId.toString()) {
                removedUserLikesID = like._id?.toString();
                return true;
            }
            else
                return false;
        });
        return {
            removedUserLikesID,
            filteredLikes,
        };
    }
    checkUserLike(userLike, reactionType, likes, userId) {
        if (userLike) {
            let previousReaction = this.findPreviousReactionType(userLike.reactionType);
            userLike.reactionType[previousReaction] = false;
            userLike.reactionType[reactionType] = true;
        }
        else {
            likes.push({
                userId,
                reactionType: {
                    isLike: false,
                    isAngry: false,
                    isCare: false,
                    isHaha: false,
                    isLove: false,
                    isSad: false,
                    isWow: false,
                    [reactionType]: true,
                },
            });
        }
    }
}
exports.default = BaseLikeController;
