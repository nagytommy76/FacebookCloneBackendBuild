"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const statics_1 = require("./statics");
const UserSchema = new mongoose_1.Schema({
    firstName: String,
    sureName: String,
    isEmailConfirmed: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: [true, 'Kérek egy email címet!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Adjon meg egy jelszót!'],
        minlength: [4, 'a jelszó min. 4 karakter legyen!'],
    },
    friends: {
        type: [
            {
                friend: { type: mongoose_1.Types.ObjectId, ref: 'User', unique: true },
                friendSince: { type: Date, default: new Date() },
                isSender: { type: Boolean, default: false },
                status: {
                    type: String,
                    enum: ['pending', 'friends', 'rejected'],
                    default: 'pending',
                },
            },
        ],
    },
    userDetails: {
        profilePicturePath: {
            type: [
                {
                    path: String,
                    isSelected: Boolean,
                },
            ],
            default: {
                path: 'https://firebasestorage.googleapis.com/v0/b/facebookimagestorage.appspot.com/o/facebook-profile.jpg?alt=media&token=654bab74-a4a3-4eab-8fdb-e7e22f116c9a',
                isSelected: true,
            },
        },
        birthTown: String,
        homeTown: String,
        relationShip: { type: { isAlone: Boolean, inRelation: Boolean }, required: false },
        studies: {
            elementary: {
                from: Number,
                to: Number,
                name: String,
            },
            highSchool: {
                from: Number,
                to: Number,
                name: String,
            },
            university: {
                from: Number,
                to: Number,
                name: String,
            },
        },
        gender: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        workPlaces: [
            {
                companyName: String,
                position: String,
                city: String,
                description: String,
                startDate: String,
                endDate: { type: String, default: null, required: false },
            },
        ],
    },
}, {
    query: {
        byGetSelectedProfilePicture() {
            return this.where({
                'userDetails.profilePicturePath': { $elemMatch: { isSelected: { $eq: true } } },
            }).select(['userDetails.profilePicturePath.$']);
        },
    },
    timestamps: true,
});
UserSchema.add({
    notifications: [
        {
            notificationType: String,
            isRead: Boolean,
            createdAt: Date,
            data: {
                id: { type: String, required: false, default: null },
                description: { type: String, required: false, default: '' },
                urlEndpoint: { type: String, required: false, default: '' },
            },
            userDetails: {
                userId: String,
                firstName: String,
                sureName: String,
                profilePicture: String,
            },
        },
    ],
});
(0, statics_1.UserStatics)(UserSchema);
exports.User = (0, mongoose_1.model)('User', UserSchema);
