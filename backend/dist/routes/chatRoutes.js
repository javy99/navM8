"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const chatRouter = express_1.default.Router();
chatRouter.use(middlewares_1.requireAuth);
chatRouter.post('/', controllers_1.accessChat);
chatRouter.get('/', controllers_1.getChats);
chatRouter.post('/group', controllers_1.createGroupChat);
chatRouter.put('/group/rename', controllers_1.renameGroup);
chatRouter.put('/group/removeUser', controllers_1.removeFromGroup);
chatRouter.put('/group/addUser', controllers_1.addToGroup);
exports.default = chatRouter;
//# sourceMappingURL=chatRoutes.js.map