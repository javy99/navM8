import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const fetchBookings = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/bookings/mybookings`)
    return response.data
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

const fetchBookingsForTour = async (tourId: string) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/api/bookings/tour/${tourId}`,
    )
    return response.data
  } catch (error) {
    console.error('Error fetching bookings for tour:', error)
    throw error
  }
}

const createBooking = async (tourId: string, bookingDate: string) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/bookings`, {
      tourId,
      date: bookingDate,
    })
    return response.data.booking
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

const cancelBooking = async (bookingId: string) => {
  try {
    await axios.delete(`${BASE_API_URL}/api/bookings/${bookingId}`)
  } catch (error) {
    console.error('Error canceling booking:', error)
    throw error
  }
}

const approveBooking = async (bookingId: string) => {
  try {
    const response = await axios.patch(
      `${BASE_API_URL}/api/bookings/${bookingId}`,
      {
        status: 'CONFIRMED',
      },
    )

    return response.data
  } catch (error) {
    console.error('Error confirming booking:', error)
    throw error
  }
}

export {
  fetchBookings,
  fetchBookingsForTour,
  createBooking,
  cancelBooking,
  approveBooking,
}
