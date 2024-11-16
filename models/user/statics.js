"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatics = UserStatics;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
function UserStatics(UserSchema) {
    UserSchema.statics.encryptPassword = async function (nativePass) {
        return await (0, bcrypt_1.hash)(nativePass, 10);
    };
    UserSchema.statics.comparePassword = async function (email, plainPass) {
        const foundUser = await this.findOne({ email });
        if (!foundUser)
            throw new Error('Nincs regisztrálva felhasználó ilyen email címmel!');
        const isPasswordCorrect = await (0, bcrypt_1.compare)(plainPass, foundUser.password);
        return { isPasswordCorrect, foundUser };
    };
    UserSchema.statics.jwtAccessTokenSign = function (userId, email, ACCESS_TOKEN_SECRET, expiresIn = '15min') {
        return jsonwebtoken_1.default.sign({ userId, email }, ACCESS_TOKEN_SECRET, { expiresIn });
    };
    UserSchema.statics.jwtRefreshTokenSign = function (userId, email, REFRESH_TOKEN_SECRET, expiresIn = '1day') {
        return jsonwebtoken_1.default.sign({ userId, email }, REFRESH_TOKEN_SECRET, { expiresIn });
    };
    UserSchema.statics.getUserByUserIdAndSelect = async function (userId) {
        return await this.aggregate([
            { $match: { _id: new mongoose_1.Types.ObjectId(userId) } },
            {
                $project: {
                    firstName: 1,
                    sureName: 1,
                    email: 1,
                    friends: 1,
                    selectedProfilePicturePath: {
                        $filter: {
                            input: '$userDetails.profilePicturePath',
                            as: 'profilePic',
                            cond: { $eq: ['$$profilePic.isSelected', true] },
                        },
                    },
                },
            },
        ]);
    };
    UserSchema.statics.getSaveNotification = async function (foundPostId, foundPostUserId, foundPostDescription, firstName, sureName, likedUserId, profilePicture, notificationType = 'isPostLike') {
        const toSaveNotification = await this.findById(foundPostUserId).select(['notifications']);
        if (toSaveNotification) {
            toSaveNotification.notifications.push({
                isRead: false,
                notificationType,
                createdAt: new Date(),
                data: {
                    id: foundPostId,
                    description: foundPostDescription,
                },
                userDetails: {
                    firstName: firstName,
                    sureName: sureName,
                    userId: likedUserId,
                    profilePicture,
                },
            });
            await toSaveNotification.save();
        }
        return toSaveNotification;
    };
}
