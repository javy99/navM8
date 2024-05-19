import express from 'express'
import { requireAuth } from '../middlewares'
import {
  createBooking,
  getBookingsForUser,
  getBookingsForTour,
  updateBookingStatus,
  deleteBooking,
} from '../controllers'

const bookingRouter = express.Router()

bookingRouter.use(requireAuth)

bookingRouter.post('/', createBooking)
bookingRouter.get('/mybookings', getBookingsForUser)
bookingRouter.get('/tours/:tourId', getBookingsForTour)
bookingRouter.patch('/:bookingId', updateBookingStatus)
bookingRouter.delete('/:bookingId', deleteBooking)

export default bookingRouter
