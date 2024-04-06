import axios from 'axios'

const fetchBookings = async (userToken: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/bookings/mybookings`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

const createBooking = async (
  tourId: string,
  bookingDate: string,
  userToken: string,
) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/bookings`,
      {
        tourId,
        date: bookingDate,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    )
    return response.data.booking
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

const cancelBooking = async (bookingId: string, userToken: string) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    )
  } catch (error) {
    console.error('Error canceling booking:', error)
    throw error
  }
}

export { fetchBookings, createBooking, cancelBooking }
