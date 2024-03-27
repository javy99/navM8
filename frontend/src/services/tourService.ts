import axios from 'axios'

const fetchMyTours = async (token: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/mytours`,
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
      `${import.meta.env.VITE_API_URL}/api/mytours`,
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

export { fetchMyTours, createTour }
