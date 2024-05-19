"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const bookingRouter = express_1.default.Router();
bookingRouter.use(middlewares_1.requireAuth);
bookingRouter.post('/', controllers_1.createBooking);
bookingRouter.get('/mybookings', controllers_1.getBookingsForUser);
bookingRouter.get('/tours/:tourId', controllers_1.getBookingsForTour);
bookingRouter.patch('/:bookingId', controllers_1.updateBookingStatus);
bookingRouter.delete('/:bookingId', controllers_1.deleteBooking);
exports.default = bookingRouter;
//# sourceMappingURL=bookingRoutes.js.map