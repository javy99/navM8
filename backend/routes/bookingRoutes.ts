import * as express from 'express'
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

bookingRouter.post('/', createBooking) // Create a booking
bookingRouter.get('/mybookings', getBookingsForUser) // Get bookings for a specific user
bookingRouter.get('/tour/:tourId', getBookingsForTour) // Get bookings for a specific tour
bookingRouter.patch('/:bookingId', updateBookingStatus) // Update booking status
bookingRouter.delete('/:bookingId', deleteBooking) // Delete a booking

export default bookingRouter
