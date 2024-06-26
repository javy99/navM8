import { Request, Response } from 'express'
import { Booking, Tour } from '../models'

function validateBookingDate(
  typeOfAvailability,
  availability,
  bookingDate,
  tourDate,
) {
  const bookingDateStart = new Date(bookingDate).setUTCHours(0, 0, 0, 0)
  const tourDateStart = new Date(tourDate).setUTCHours(0, 0, 0, 0)

  const dayOfWeek = bookingDate.getDay()
  if (typeOfAvailability === 'recurring') {
    switch (availability) {
      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5
      case 'weekends':
        return dayOfWeek === 0 || dayOfWeek === 6
      case 'daily':
        return true
      default:
        return false
    }
  } else if (typeOfAvailability === 'one-time') {
    return bookingDateStart === tourDateStart
  }
  return false
}

const createBooking = async (req: Request, res: Response) => {
  try {
    const { tourId, date: bookingDateStr } = req.body
    const userId = req.user._id

    // Convert booking date to a Date object for comparison
    const bookingDateObj = new Date(bookingDateStr)
    bookingDateObj.setUTCHours(0, 0, 0, 0)

    const tour = await Tour.findById(tourId)
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' })
    }

    if (tour.author.toString() === userId.toString()) {
      return res
        .status(403)
        .json({ error: 'Users cannot book their own tours.' })
    }

    // Check if the tour is already fully booked
    const existingBookingsCount = await Booking.countDocuments({
      tour: tourId,
      date: bookingDateObj,
      status: { $in: ['PENDING', 'CONFIRMED'] },
    })
    if (existingBookingsCount >= tour.maxPeople) {
      return res
        .status(400)
        .json({ error: 'This tour is fully booked for the selected date.' })
    }

    // Validation logic based on tour's type of availability
    const isValidDate = validateBookingDate(
      tour.typeOfAvailability,
      tour.availability,
      bookingDateObj,
      tour.date,
    )

    if (!isValidDate) {
      return res.status(400).json({
        error: "Invalid booking date for the selected tour's availability",
      })
    }

    // Proceed with booking creation if the date is valid
    const newBooking = await Booking.create({
      tour,
      userId,
      date: bookingDateObj,
      status: 'PENDING',
    })

    res.status(201).json(newBooking)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getBookingsForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id
    const bookings = await Booking.find({ userId })
      .populate('tour')
      .populate('userId')
    res.status(200).json(bookings)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

const getBookingsForTour = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params
    const bookings = await Booking.find({ tour: tourId })
      .populate('tour')
      .populate('userId')
    res.status(200).json(bookings)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params
    const { status } = req.body

    const userId = req.user._id

    if (!status) {
      return res.status(400).json({ error: 'Status must be provided' })
    }

    const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided' })
    }

    const booking = await Booking.findById(bookingId).populate('tour')
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (
      status === 'CONFIRMED' &&
      booking.tour.author.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ error: 'Only the tour author can confirm bookings' })
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true },
    ).populate('tour', 'name author')

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Unable to update booking status' })
    }
    res.status(200).json(updatedBooking)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params
    const booking = await Booking.findByIdAndDelete(bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export {
  createBooking,
  getBookingsForUser,
  getBookingsForTour,
  updateBookingStatus,
  deleteBooking,
}
