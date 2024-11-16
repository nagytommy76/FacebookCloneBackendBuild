"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentSelectedProfileImage = exports.editSelectedProfilePicture = exports.saveUserProfilePicture = exports.getCurrentProfilePictures = exports.getUserDetailsWithOwnPosts = void 0;
const user_1 = require("../../../models/user/user");
const getUserDetailsWithOwnPosts = async (request, response) => {
    const userId = request.query.userId;
    if (!userId)
        return response.status(404).json({ msg: 'user not found' });
    try {
        const foundUserWithPosts = await user_1.User.findById(userId);
        return response.status(200).json(foundUserWithPosts);
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error, msg: 'internal server error' });
    }
};
exports.getUserDetailsWithOwnPosts = getUserDetailsWithOwnPosts;
const getCurrentProfilePictures = async (request, response) => {
    const userId = request.user?.userId;
    if (!userId)
        return response.status(404).json({ msg: 'user not found' });
    try {
        const foundUser = await user_1.User.findById(userId).select('userDetails.profilePicturePath').lean();
        if (!foundUser)
            return response.status(404).json({ msg: 'user not found' });
        return response.status(200).json(foundUser.userDetails.profilePicturePath);
    }
    catch (error) {
        response.status(500).json({ error });
    }
};
exports.getCurrentProfilePictures = getCurrentProfilePictures;
const saveUserProfilePicture = async (request, response) => {
    const userId = request.user.userId;
    const profilePicturePath = request.body.profilePicturePath;
    if (!userId)
        return response.status(404).json({ msg: 'user not found' });
    try {
        const foundUser = await user_1.User.findById(userId).select('userDetails.profilePicturePath');
        if (!foundUser)
            return response.status(404).json({ msg: 'user not found' });
        // Végigmenni mindegyik képen és a selected mezőt false-ra állítani
        foundUser.userDetails.profilePicturePath.map((image) => (image.isSelected = false));
        foundUser.userDetails.profilePicturePath.push({ isSelected: true, path: profilePicturePath });
        await foundUser.save();
        return response.status(200).json({ profilePicturePath: foundUser.userDetails.profilePicturePath });
    }
    catch (error) {
        response.status(500).json({ error });
    }
};
exports.saveUserProfilePicture = saveUserProfilePicture;
const editSelectedProfilePicture = async (request, response) => {
    // Ezeket majd egyszerürsíteni kéne
    const userId = request.user.userId;
    const modifyId = request.body.modifyId;
    if (!userId)
        return response.status(404).json({ msg: 'user not found' });
    try {
        const foundUser = await user_1.User.findById(userId).select('userDetails.profilePicturePath');
        if (!foundUser)
            return response.status(404).json({ msg: 'user not found' });
        foundUser.userDetails.profilePicturePath.map((image) => {
            if (image._id == modifyId)
                image.isSelected = true;
            else
                image.isSelected = false;
        });
        await foundUser.save();
        response.status(200).json({ profilePicturePath: foundUser.userDetails.profilePicturePath });
    }
    catch (error) {
        response.status(500).json({ error });
    }
};
exports.editSelectedProfilePicture = editSelectedProfilePicture;
const getCurrentSelectedProfileImage = async (request, response) => {
    // Ezeket majd egyszerürsíteni kéne
    const userId = request.user.userId;
    if (!userId)
        return response.status(404).json({ msg: 'user not found' });
    try {
        const foundUser = await user_1.User.findById(userId).select('userDetails.profilePicturePath');
        if (!foundUser)
            return response.status(404).json({ msg: 'user not found' });
        const selectedProfilePic = foundUser.userDetails.profilePicturePath.find((image) => image.isSelected === true);
        response.status(200).json({ currentImage: selectedProfilePic });
    }
    catch (error) {
        response.status(500).json({ error });
    }
};
exports.getCurrentSelectedProfileImage = getCurrentSelectedProfileImage;
