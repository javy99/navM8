"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsForTour = exports.createReview = void 0;
const models_1 = require("../models");
const createReview = async (req, res) => {
    const { tourId, rating, comment } = req.body;
    if (!tourId || rating == null || !comment) {
        return res
            .status(400)
            .json({ message: 'Please provide rating and comment' });
    }
    const userId = req.user._id;
    const booking = await models_1.Booking.findOne({
        tour: tourId,
        userId,
        status: 'COMPLETED',
    });
    if (!booking) {
        return res
            .status(400)
            .json({ message: "Can't review without a completed tour" });
    }
    const review = new models_1.Review({
        tour: tourId,
        user: userId,
        rating,
        comment,
    });
    await review.save();
    await models_1.Tour.findByIdAndUpdate(tourId, { $inc: { reviewCount: 1 } });
    res.status(201).json(review);
};
exports.createReview = createReview;
const getReviewsForTour = async (req, res) => {
    const { tourId } = req.params;
    try {
        const reviews = await models_1.Review.find({ tour: tourId })
            .populate('user', 'firstName lastName profilePictureURL')
            .exec();
        if (reviews.length === 0) {
            return res
                .status(404)
                .json({ message: 'No reviews found for this tour.' });
        }
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching reviews.' });
    }
};
exports.getReviewsForTour = getReviewsForTour;
//# sourceMappingURL=reviewController.js.map