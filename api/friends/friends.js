"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accessTokenRefresh_1 = require("../../middlewares/accessTokenRefresh");
const getFriends_1 = require("../../controllers/friends/getFriends");
const friends_1 = require("../../controllers/friends/friends");
const confirmFriend_1 = require("../../controllers/friends/confirmFriend");
const removeFriend_1 = require("../../controllers/friends/removeFriend");
class FriendsApi {
    router;
    io;
    constructor(io) {
        this.io = io;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.get('/get-friends', getFriends_1.getUsers);
        this.router.get('/get-accepted-friends', accessTokenRefresh_1.authenticateAccessTokenForApi, (request, response) => (0, getFriends_1.getAcceptedUsers)(request, response, this.io));
        this.router.post('/make-friendship', accessTokenRefresh_1.authenticateAccessTokenForApi, friends_1.makeFriendshipController);
        this.router.post('/confirm-friendship', accessTokenRefresh_1.authenticateAccessTokenForApi, confirmFriend_1.confirmFriendshipController);
        this.router.delete('/remove-friend', accessTokenRefresh_1.authenticateAccessTokenForApi, removeFriend_1.removeFriendController);
    }
}
exports.default = FriendsApi;
