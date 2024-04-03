import axios from 'axios'

const getAllTours = async (token: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/tours`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (error) {
    throw error
  }
}

const fetchMyTours = async (token: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/tours/mytours`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (error) {
    throw error
  }
}

const createTour = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/tours/mytours`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export { getAllTours, fetchMyTours, createTour }
