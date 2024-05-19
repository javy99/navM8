"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const userRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
userRouter.get('/', controllers_1.getAllUsers);
userRouter.use(middlewares_1.requireAuth);
userRouter.patch('/:id', controllers_1.updateProfile);
userRouter.get('/:id', controllers_1.getProfile);
userRouter.post('/:id/photo', upload.single('profilePictureURL'), controllers_1.uploadProfilePhoto);
userRouter.get('/:id/photo', controllers_1.getProfilePhoto);
userRouter.delete('/:id/photo', controllers_1.deleteProfilePhoto);
userRouter.post('/:id/favoriteTours', controllers_1.addFavoriteTour);
userRouter.get('/:id/favoriteTours', controllers_1.getFavoriteTours);
userRouter.delete('/:id/favoriteTours/:tourId', controllers_1.deleteFavoriteTour);
exports.default = userRouter;
//# sourceMappingURL=userRoutes.js.map