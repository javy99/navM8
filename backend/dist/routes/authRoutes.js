"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const authRouter = express_1.default.Router();
authRouter.post('/signup', controllers_1.signupUser);
authRouter.post('/login', controllers_1.loginUser);
authRouter.post('/logout', middlewares_1.requireAuth, controllers_1.logoutUser);
authRouter.get('/refresh_token', middlewares_1.requireAuth, controllers_1.refreshTokenHandler);
authRouter.get('/user', middlewares_1.requireAuth, controllers_1.getUser);
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map