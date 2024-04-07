import * as express from 'express'
import { requireAuth } from '../middlewares'
import { createReview, getReviewsForTour } from '../controllers'

const reviewRouter = express.Router()

reviewRouter.use(requireAuth)

reviewRouter.post('/', createReview)
reviewRouter.get('/:tourId', getReviewsForTour)

export default reviewRouter
