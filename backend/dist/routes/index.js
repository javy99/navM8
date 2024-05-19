"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = exports.userRouter = exports.authRouter = exports.toursRouter = exports.reviewRouter = exports.messageRouter = exports.bookingRouter = void 0;
var bookingRoutes_1 = require("./bookingRoutes");
Object.defineProperty(exports, "bookingRouter", { enumerable: true, get: function () { return __importDefault(bookingRoutes_1).default; } });
var messageRoutes_1 = require("./messageRoutes");
Object.defineProperty(exports, "messageRouter", { enumerable: true, get: function () { return __importDefault(messageRoutes_1).default; } });
var reviewRoutes_1 = require("./reviewRoutes");
Object.defineProperty(exports, "reviewRouter", { enumerable: true, get: function () { return __importDefault(reviewRoutes_1).default; } });
var toursRoutes_1 = require("./toursRoutes");
Object.defineProperty(exports, "toursRouter", { enumerable: true, get: function () { return __importDefault(toursRoutes_1).default; } });
var authRoutes_1 = require("./authRoutes");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return __importDefault(authRoutes_1).default; } });
var userRoutes_1 = require("./userRoutes");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(userRoutes_1).default; } });
var chatRoutes_1 = require("./chatRoutes");
Object.defineProperty(exports, "chatRouter", { enumerable: true, get: function () { return __importDefault(chatRoutes_1).default; } });
//# sourceMappingURL=index.js.map