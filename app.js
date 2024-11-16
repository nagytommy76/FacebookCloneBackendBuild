"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const redis_config_1 = __importDefault(require("./config/redis.config"));
const socketIo_config_1 = __importDefault(require("./config/socketIo.config"));
// REDIS SOCKET.IO
const redis_adapter_1 = require("@socket.io/redis-adapter");
const https_1 = require("https");
const socket_io_1 = require("socket.io");
// API ROUTES
const chat_1 = __importDefault(require("./api/chat/chat"));
const friends_1 = __importDefault(require("./api/friends/friends"));
const post_1 = __importDefault(require("./api/post/post"));
class App {
    app;
    server;
    io;
    socketController;
    accessLogStream;
    constructor() {
        this.app = (0, express_1.default)();
        this.server = (0, https_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.server, {
            adapter: (0, redis_adapter_1.createAdapter)(redis_config_1.default.client, redis_config_1.default.subClient),
            cors: {
                origin: ['http://localhost:3000'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        this.socketController = new socketIo_config_1.default(this.io);
        this.accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'access.log'), { flags: 'a' });
        this.configureApp();
        this.configureAPIroutes();
        this.configureSockets();
    }
    async connectDB() {
        try {
            const DB_CONNECTION = process.env.MONGO_CONNECTION_STRING || '';
            mongoose_1.default.set('strictQuery', true);
            const connection = await mongoose_1.default.connect(DB_CONNECTION);
            console.log(`MongoDB connected: ${connection.connection.host}`);
        }
        catch (error) {
            process.exit(1);
        }
    }
    configureApp() {
        this.app.use(express_1.default.json());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(body_parser_1.default.json());
        this.app.use((0, morgan_1.default)('combined', { stream: this.accessLogStream }));
        this.app.use((0, cors_1.default)({
            credentials: true,
            origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:6060'],
        }));
    }
    configureAPIroutes() {
        this.app.use('/api/user', require('./api/user/userData'));
        this.app.use('/api/auth', require('./api/user/user'));
        this.app.use('/api/friends', new friends_1.default(this.socketController).router);
        this.app.use('/api/chat', new chat_1.default().router);
        this.app.use('/api/post', new post_1.default(this.socketController).router);
        this.app.use('/api/post/edit', require('./api/post/modify/modify'));
    }
    configureSockets() {
        this.socketController.initializeSocketHandlers();
    }
    async start(port = 5050) {
        await redis_config_1.default.connect(); // Connect to Redis before starting the server
        await this.connectDB();
        this.app.listen(port, () => {
            console.log(`The app started on port: ${port}`);
        });
    }
}
exports.default = new App();
