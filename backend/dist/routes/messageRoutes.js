"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const messageRouter = express_1.default.Router();
messageRouter.use(middlewares_1.requireAuth);
messageRouter.post('/', controllers_1.sendMessage);
messageRouter.get('/:chatId', controllers_1.getAllMessages);
exports.default = messageRouter;
//# sourceMappingURL=messageRoutes.js.map