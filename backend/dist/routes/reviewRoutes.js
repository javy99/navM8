"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const reviewRouter = express_1.default.Router();
reviewRouter.use(middlewares_1.requireAuth);
reviewRouter.post('/', controllers_1.createReview);
reviewRouter.get('/:tourId', controllers_1.getReviewsForTour);
exports.default = reviewRouter;
//# sourceMappingURL=reviewRoutes.js.map