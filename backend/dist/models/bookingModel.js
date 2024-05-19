"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const bookingSchema = new Schema({
    tour: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Tour',
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING',
    },
}, {
    timestamps: true,
});
const Booking = mongoose_1.default.model('Booking', bookingSchema);
exports.Booking = Booking;
//# sourceMappingURL=bookingModel.js.map