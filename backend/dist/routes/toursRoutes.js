"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const toursRouter = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
toursRouter.get('/', controllers_1.getAllTours);
toursRouter.use(middlewares_1.requireAuth);
toursRouter.post('/mytours', upload.array('photos'), controllers_1.createTour);
toursRouter.put('/mytours/:id', upload.array('photos'), controllers_1.updateTour);
toursRouter.delete('/mytours/:id', controllers_1.deleteTour);
toursRouter.get('/mytours', controllers_1.getMyTours);
toursRouter.get('/:id', controllers_1.getTour);
toursRouter.get('/user/:id', controllers_1.getUserTours);
exports.default = toursRouter;
//# sourceMappingURL=toursRoutes.js.map