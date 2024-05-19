"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.updateBookingStatus = exports.getBookingsForTour = exports.getBookingsForUser = exports.createBooking = void 0;
const models_1 = require("../models");
function validateBookingDate(typeOfAvailability, availability, bookingDate, tourDate) {
    const bookingDateStart = new Date(bookingDate).setUTCHours(0, 0, 0, 0);
    const tourDateStart = new Date(tourDate).setUTCHours(0, 0, 0, 0);
    const dayOfWeek = bookingDate.getDay();
    if (typeOfAvailability === 'recurring') {
        switch (availability) {
            case 'weekdays':
                return dayOfWeek >= 1 && dayOfWeek <= 5;
            case 'weekends':
                return dayOfWeek === 0 || dayOfWeek === 6;
            case 'daily':
                return true;
            default:
                return false;
        }
    }
    else if (typeOfAvailability === 'one-time') {
        return bookingDateStart === tourDateStart;
    }
    return false;
}
const createBooking = async (req, res) => {
    try {
        const { tourId, date: bookingDateStr } = req.body;
        const userId = req.user._id;
        // Convert booking date to a Date object for comparison
        const bookingDateObj = new Date(bookingDateStr);
        bookingDateObj.setUTCHours(0, 0, 0, 0);
        const tour = await models_1.Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }
        if (tour.author.toString() === userId.toString()) {
            return res
                .status(403)
                .json({ error: 'Users cannot book their own tours.' });
        }
        // Check if the tour is already fully booked
        const existingBookingsCount = await models_1.Booking.countDocuments({
            tour: tourId,
            date: bookingDateObj,
            status: { $in: ['PENDING', 'CONFIRMED'] },
        });
        if (existingBookingsCount >= tour.maxPeople) {
            return res
                .status(400)
                .json({ error: 'This tour is fully booked for the selected date.' });
        }
        // Validation logic based on tour's type of availability
        const isValidDate = validateBookingDate(tour.typeOfAvailability, tour.availability, bookingDateObj, tour.date);
        if (!isValidDate) {
            return res.status(400).json({
                error: "Invalid booking date for the selected tour's availability",
            });
        }
        // Proceed with booking creation if the date is valid
        const newBooking = await models_1.Booking.create({
            tour,
            userId,
            date: bookingDateObj,
            status: 'PENDING',
        });
        res.status(201).json(newBooking);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createBooking = createBooking;
const getBookingsForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await models_1.Booking.find({ userId })
            .populate('tour')
            .populate('userId');
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getBookingsForUser = getBookingsForUser;
const getBookingsForTour = async (req, res) => {
    try {
        const { tourId } = req.params;
        const bookings = await models_1.Booking.find({ tour: tourId })
            .populate('tour')
            .populate('userId');
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getBookingsForTour = getBookingsForTour;
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const userId = req.user._id;
        if (!status) {
            return res.status(400).json({ error: 'Status must be provided' });
        }
        const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status provided' });
        }
        const booking = await models_1.Booking.findById(bookingId).populate('tour');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (status === 'CONFIRMED' &&
            booking.tour.author.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ error: 'Only the tour author can confirm bookings' });
        }
        const updatedBooking = await models_1.Booking.findByIdAndUpdate(bookingId, { status }, { new: true }).populate('tour', 'name author');
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Unable to update booking status' });
        }
        res.status(200).json(updatedBooking);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await models_1.Booking.findByIdAndDelete(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json({ message: 'Booking deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteBooking = deleteBooking;
//# sourceMappingURL=bookingControllers.js.map