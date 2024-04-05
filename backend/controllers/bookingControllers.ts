// bookingController.ts
import { Request, Response } from 'express'
import { Booking, Tour } from '../models'

const createBooking = async (req: Request, res: Response) => {
  try {
    const { tourId, date: bookingDate } = req.body
    const userId = req.user._id

    // Fetch the tour to check its availability type
    const tour = await Tour.findById(tourId)
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' })
    }

    // Prevent users from booking their own tours
    if (tour.author.toString() === userId.toString()) {
      return res
        .status(403)
        .json({ error: 'Users cannot book their own tours.' })
    }

    // Convert booking date to a Date object for comparison
    const bookingDateObj = new Date(bookingDate)

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
      tour: tour,
      userId,
      date: bookingDateObj,
      status: 'PENDING',
    })

    res.status(201).json(newBooking)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

function validateBookingDate(
  typeOfAvailability,
  availability,
  bookingDate,
  tourDate,
) {
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
    // For one-time tours, ensure the booking date matches the tour date
    // Assuming the tour's `date` field is also a Date object
    return (
      bookingDate.setHours(0, 0, 0, 0) ===
      new Date(tourDate).setHours(0, 0, 0, 0)
    )
  }
  return false
}

const getBookingsForUser = async (req: Request, res: Response) => {
  // Logic to retrieve bookings for a specific user
  try {
    const userId = req.user._id
    const bookings = await Booking.find({ userId }).populate('tour')
    res.status(200).json(bookings)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

const getBookingsForTour = async (req: Request, res: Response) => {
  // Logic to retrieve bookings for a specific tour
  try {
    const { tourId } = req.params
    console.log(tourId)
    const bookings = await Booking.find({ _id: tourId }).populate('tour')
    res.status(200).json(bookings)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

const updateBookingStatus = async (req: Request, res: Response) => {
  // Logic to update the status of a booking
  try {
    const { bookingId } = req.params
    const { status } = req.body

    // Check if status is provided in the request body
    if (!status) {
      return res.status(400).json({ error: 'Status must be provided' })
    }

    // Check if the provided status is one of the allowed values
    const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided' })
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true },
    )
    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.status(200).json(updatedBooking)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteBooking = async (req: Request, res: Response) => {
  // Logic to delete a booking
  try {
    const { bookingId } = req.params
    const booking = await Booking.findByIdAndDelete(bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.status(204).send() // No content to send back
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
