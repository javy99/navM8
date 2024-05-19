"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const routes_1 = require("./routes");
const middlewares_1 = require("./middlewares");
dotenv_1.default.config();
const { MONGODB_URL, PORT } = process.env;
// express app
const app = (0, express_1.default)();
// middleware
app.use((0, cookie_parser_1.default)());
app.options('*', (0, cors_1.default)({
    origin: ['http://localhost:3001', 'https://navm8.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*'],
}));
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001', 'https://navm8.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*'],
}));
app.use(express_1.default.json({ limit: '50mb' }));
// Initialize HTTP server from Express app
const server = http_1.default.createServer(app);
// Initialize socket.io and bind it to the HTTP server
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: ['http://localhost:3001', 'https://navm8.vercel.app'],
    },
});
// socket.io connection event
io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
        socket.on('disconnect', () => {
            console.log('USER DISCONNECTED');
            socket.leave(userData._id);
        });
    });
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room:', room);
    });
    socket.on('typing', ({ chatId }) => socket.to(chatId).emit('typing', { chatId }));
    socket.on('stop typing', ({ chatId }) => socket.to(chatId).emit('stop typing', { chatId }));
    socket.on('new message', (newMessageReceived) => {
        const { chat } = newMessageReceived;
        if (!chat.users)
            return console.log('Chat.users not defined');
        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id)
                return;
            socket.in(user._id).emit('message received', newMessageReceived);
        });
    });
});
app.get('/', (_req, res) => {
    res.send('Server is ready');
});
// routes
app.use('/api/bookings', routes_1.bookingRouter);
app.use('/api/messages', routes_1.messageRouter);
app.use('/api/reviews', routes_1.reviewRouter);
app.use('/api/tours', routes_1.toursRouter);
app.use('/api/users', routes_1.userRouter);
app.use('/api/auth', routes_1.authRouter);
app.use('/api/chats', routes_1.chatRouter);
app.use(middlewares_1.notFound);
app.use(middlewares_1.errorHandler);
// Error handling middleware
app.use((error, req, res, _next) => {
    res
        .status(error.status || 500)
        .json({ message: error.message || 'An unexpected error occurred' });
});
// connect to MongoDB
if (MONGODB_URL) {
    mongoose_1.default
        .connect(MONGODB_URL)
        .then(() => {
        server.listen(PORT, () => {
            console.log('==============================================================');
            console.log(`===== Connected to MongoDB and listening on port ${PORT} :) =====`);
            console.log('==============================================================');
        });
    })
        .catch((err) => {
        if (err instanceof Error) {
            console.error('Error connecting to MongoDB:', err.message);
        }
        else {
            console.error('Error connecting to MongoDB with an unexpected type');
        }
    });
}
else {
    console.error('MONGODB_URL is not defined');
}
//# sourceMappingURL=server.js.map