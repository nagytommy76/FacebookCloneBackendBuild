"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const endpoints_config_1 = require("./endpoints.config");
class RedisService {
    client;
    subClient;
    constructor() {
        this.client = (0, redis_1.createClient)({
            password: endpoints_config_1.REDIS_PASSWORD,
            socket: {
                host: 'redis-13848.c250.eu-central-1-1.ec2.redns.redis-cloud.com',
                port: 13848,
            },
        }).on('error', (err) => console.log('Redis Client Error', err));
        this.subClient = this.client.duplicate();
    }
    async getAllUsers(friendIds) {
        const allOnlineFriends = {};
        for (let index = 0; index < friendIds.length; index++) {
            const friend = await this.getUserById(friendIds[index]);
            if (Object.keys(friend).length !== 0) {
                allOnlineFriends[friendIds[index]] = friend;
            }
        }
        return allOnlineFriends;
    }
    async setActiveUserById(userId, newSocketId, isActive = false) {
        if (!userId)
            return;
        return await this.client.hSet(`activeUsers:${userId}`, {
            isActive: isActive ? 1 : 0,
            socketId: newSocketId,
            lastSeen: Date.now(),
        });
    }
    async getUserById(userId = '') {
        return (await this.client.hGetAll(`activeUsers:${userId}`));
    }
    async addOnlineFriend(userId, socketId) {
        // Check to see user is already in redis
        const userIsInRedis = await this.client.hExists(`activeUsers:${userId}`, 'userId');
        // if true we don't need to add them again
        if (userIsInRedis) {
            return await this.setActiveUserById(userId, socketId, true);
        }
        else {
            if (!userId)
                return;
            return await this.client.hSet(`activeUsers:${userId}`, {
                userId: userId,
                socketId: socketId,
                isActive: 1,
                lastSeen: Date.now(),
            });
        }
    }
    async connect() {
        await this.client.connect();
        await this.subClient.connect();
    }
}
exports.default = new RedisService();
