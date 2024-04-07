import { Request, Response } from 'express'
import { Review, Booking, Tour } from '../models'

const createReview = async (req: Request, res: Response) => {
  const { tourId, rating, comment } = req.body

  if (!tourId || rating == null || !comment) {
    return res
      .status(400)
      .json({ message: 'Please provide rating and comment' })
  }

  const userId = req.user._id

  // Check if booking is completed
  const booking = await Booking.findOne({
    tour: tourId,
    userId,
    status: 'COMPLETED',
  })

  if (!booking) {
    return res
      .status(400)
      .json({ message: "Can't review without a completed tour" })
  }

  const review = new Review({
    tour: tourId,
    user: userId,
    rating,
    comment,
  })

  await review.save()

  await Tour.findByIdAndUpdate(tourId, { $inc: { reviewCount: 1 } })

  res.status(201).json(review)
}

const getReviewsForTour = async (req: Request, res: Response) => {
  const { tourId } = req.params

  try {
    const reviews = await Review.find({ tour: tourId })
      .populate('user', 'firstName lastName profilePictureURL')
      .exec()

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: 'No reviews found for this tour.' })
    }

    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews.' })
  }
}

export { createReview, getReviewsForTour }
