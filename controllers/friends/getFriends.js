"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAcceptedUsers = exports.getAcceptedFriendsModel = exports.getUsers = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../../models/user/user");
const redis_config_1 = __importDefault(require("../../config/redis.config"));
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/filter/
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/
const getUsers = async (request, response) => {
    try {
        const users = await user_1.User.aggregate([
            {
                $addFields: {
                    dateOfBirth: { $add: ['$userDetails.dateOfBirth'] },
                },
            },
            {
                $project: {
                    firstName: 1,
                    sureName: 1,
                    email: 1,
                    createdAt: 1,
                    friends: 1,
                    dateOfBirth: 1,
                    selectedProfilePicture: {
                        $filter: {
                            input: '$userDetails.profilePicturePath',
                            as: 'profilePic',
                            cond: { $eq: ['$$profilePic.isSelected', true] },
                        },
                    },
                    lastWorkPlace: {
                        $filter: {
                            input: '$userDetails.workPlaces',
                            as: 'workPlace',
                            cond: { $eq: ['$$workPlace.endDate', null] },
                        },
                    },
                },
            },
        ]);
        return response.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        return response.status(500).json(error);
    }
};
exports.getUsers = getUsers;
// https://stackoverflow.com/questions/50363220/modelling-for-friends-schema-in-mongoose
const getAcceptedFriendsModel = async (userId) => {
    return await user_1.User.aggregate([
        {
            $match: { _id: userId },
        },
        {
            $project: {
                friends: {
                    $filter: {
                        input: '$friends',
                        as: 'friend',
                        cond: { $eq: ['$$friend.status', 'friends'] },
                    },
                },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'friends.friend',
                foreignField: '_id',
                as: 'myFoundFriendsData',
                pipeline: [
                    {
                        $project: {
                            firstName: 1,
                            sureName: 1,
                            selectedProfilePicture: {
                                $filter: {
                                    input: '$userDetails.profilePicturePath',
                                    as: 'profilePic',
                                    cond: { $eq: ['$$profilePic.isSelected', true] },
                                },
                            },
                        },
                    },
                ],
            },
        },
    ]);
};
exports.getAcceptedFriendsModel = getAcceptedFriendsModel;
// Átalakítani mert nem kell lookup -> nincs már Friends model a DB-ben
const getAcceptedUsers = async (request, response, io) => {
    const userId = new mongoose_1.Types.ObjectId(request.user.userId);
    try {
        const acceptedFriends = await (0, exports.getAcceptedFriendsModel)(userId);
        const allFriendIds = acceptedFriends[0].myFoundFriendsData.map((friend) => friend._id);
        const allOnlineFriends = await redis_config_1.default.getAllUsers(allFriendIds);
        return response
            .status(200)
            .json({ myFoundFriendsData: acceptedFriends[0].myFoundFriendsData, allOnlineFriends });
    }
    catch (error) {
        console.log(error);
        return response.status(500).json(error);
    }
};
exports.getAcceptedUsers = getAcceptedUsers;
