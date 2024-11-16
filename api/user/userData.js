"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userDataValidator_1 = require("./validators/userDataValidator");
const accessTokenRefresh_1 = require("../../middlewares/accessTokenRefresh");
const authenticateUser_1 = require("../../middlewares/authenticateUser");
const userDetails_1 = require("../../controllers/users/userDetails/userDetails");
const notifications_1 = require("../../controllers/notifications/notifications");
const userProfile_1 = require("../../controllers/users/userDetails/userProfile");
class UserDataApi {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.get('/notifications', accessTokenRefresh_1.authenticateAccessTokenForApi, notifications_1.getNotifications);
        this.router.patch('/set-active', accessTokenRefresh_1.authenticateAccessTokenForApi, notifications_1.setActiveNotifications);
        this.router.delete('/notification', accessTokenRefresh_1.authenticateAccessTokenForApi, notifications_1.removeUsersNotification);
        this.router.get('/get-details', accessTokenRefresh_1.authenticateAccessTokenForApi, userDetails_1.getUserDetailsWithOwnPosts);
        this.router.get('/get-profile-pictures', accessTokenRefresh_1.authenticateAccessTokenForApi, userDetails_1.getCurrentProfilePictures);
        this.router.get('/get-current-picture', accessTokenRefresh_1.authenticateAccessTokenForApi, userDetails_1.getCurrentSelectedProfileImage);
        this.router.post('/save-profile-picture', accessTokenRefresh_1.authenticateAccessTokenForApi, userDetails_1.saveUserProfilePicture);
        this.router.put('/edit-profile-picture', accessTokenRefresh_1.authenticateAccessTokenForApi, userDetails_1.editSelectedProfilePicture);
        // Profile Work/studies etc..
        this.router.post('/save-workplace', userDataValidator_1.ValidateAddWorkplace, accessTokenRefresh_1.authenticateAccessTokenForApi, authenticateUser_1.authenticateUserCredentials, userProfile_1.addNewWorkplaceController);
        this.router.put('/remove-work', accessTokenRefresh_1.authenticateAccessTokenForApi, authenticateUser_1.authenticateUserCredentials, userProfile_1.removeSingleWorkplace);
    }
}
exports.default = UserDataApi;
