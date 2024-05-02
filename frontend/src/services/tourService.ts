import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

const getAllTours = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/tours`)
    return response.data
  } catch (error) {
    throw error
  }
}

const fetchMyTours = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/tours/mytours`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

const createTour = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/tours/mytours`,
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

const getTourById = async (tourId: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/tours/${tourId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

const updateTour = async (id: string, formData: FormData, token: string) => {
  const response = await axios.put(
    `${BASE_API_URL}/api/tours/mytours/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

const deleteTour = async (tourId: string, token: string) => {
  try {
    await axios.delete(`${BASE_API_URL}/api/tours/mytours/${tourId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    throw error
  }
}

export {
  getAllTours,
  fetchMyTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
}
