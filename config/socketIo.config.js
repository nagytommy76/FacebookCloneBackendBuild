"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_config_1 = __importDefault(require("./redis.config"));
class SocketService {
    io;
    onlineFriends = [];
    constructor(io) {
        this.io = io;
    }
    initializeSocketHandlers() {
        this.io.listen(3001);
        this.io.on('connection', (socket) => {
            socket.on('login', (userId) => {
                socket.userId = userId;
            });
            socket.on('newUser', async (args) => {
                const { userId, userName } = args;
                // The userId loses its value after the server is restarted (saved)... SOLUTION!!!
                socket.userId = userId;
                await redis_config_1.default.addOnlineFriend(userId, socket.id);
                if (userId) {
                    const onlineUserData = await redis_config_1.default.getUserById(userId);
                    socket.broadcast.emit('online:friend', {
                        onlineUserData,
                        userName,
                        profilePicture: args.profilePicture,
                    });
                }
            });
            socket.on('join_room', (args) => {
                socket.join(args.chatRoomId);
            });
            // CHAT ---------------------------------------------------------------------
            socket.on('chat:createChat', (args) => {
                let foundUserSocketId = this.onlineFriends.find((user) => user.userId === args.toUserId)?.socketId;
                if (foundUserSocketId)
                    socket.broadcast.to(foundUserSocketId).emit('chat:createChatResponse', args);
            });
            socket.on('chat:typing', (args) => socket.broadcast.to(args.chatId).emit('chat:typingResponse', args));
            socket.on('chat:sendMsg', (args) => {
                socket.broadcast.to(args.foundChatId).emit('chat:endTypingResponse');
                socket.broadcast.to(args.foundChatId).emit('chat:sendMsgResponse', args);
            });
            socket.on('chat:deleteMsg', (args) => {
                socket.broadcast.to(args.chatId).emit('chat:deleteMsgResponse', args);
            });
            socket.on('chat:addMessageReaction', (args) => {
                socket.broadcast.to(args.chatId).emit('chat:addMessageReactionResponse', args);
            });
            socket.on('chat:deleteLike', (args) => {
                socket.broadcast.to(args.chatId).emit('chat:deleteLikeResponse', args);
            });
            socket.on('chat:deleteChat', (args) => {
                socket.broadcast.to(args.chatId).emit('chat:deleteChatResponse', args);
            });
            // --------------------------------------------------------------------------
            // FRIENDS -------------------------------------------------------------------
            socket.on('friend:join_friend', (args) => {
                socket.join(args.friendId);
            });
            socket.on('friend:withdrawFriend', (args) => {
                socket.broadcast.to(args.friendId).emit('friend:withdrawFriendResponse', args);
            });
            socket.on('friend:rejectFriend', (args) => {
                socket.broadcast.to(args.roomId).emit('friend:rejectFriendResponse', args);
            });
            socket.on('friend:checkOnlineFriends', async (args) => {
                const allOnlineFriends = await redis_config_1.default.getAllUsers(args.friendIds);
                socket.emit('friend:checkOnlineFriendsResponse', allOnlineFriends);
            });
            socket.on('disconnect', async () => {
                await redis_config_1.default.setActiveUserById(socket.userId, socket.id, false);
                const userData = await redis_config_1.default.getUserById(socket.userId);
                socket.broadcast.emit('offline:friend', { userData, userId: socket.userId });
            });
        });
    }
}
exports.default = SocketService;
