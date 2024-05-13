import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const getAllTours = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/tours`)
    return response.data
  } catch (error) {
    throw error
  }
}

const fetchMyTours = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/tours/mytours`)
    return response.data
  } catch (error) {
    throw error
  }
}

const createTour = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/tours/mytours`,
      formData,
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

const updateTour = async (id: string, formData: FormData) => {
  const response = await axios.put(
    `${BASE_API_URL}/api/tours/mytours/${id}`,
    formData,
  )
  return response.data
}

const deleteTour = async (tourId: string) => {
  try {
    await axios.delete(`${BASE_API_URL}/api/tours/mytours/${tourId}`)
  } catch (error) {
    throw error
  }
}

const getUserTours = async (userId) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/tours/user/${userId}`)
    return response.data
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
  getUserTours,
}
