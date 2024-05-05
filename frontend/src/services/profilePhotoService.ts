import axios from 'axios'

const BASE_API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const fetchProfilePhoto = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/users/${id}/photo`)
    return response.data.profilePictureURL
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        return null
      }
      console.error('Error fetching profile photo:', error)
      throw error
    }
  }
}

const updateProfilePhoto = async (id: string, file: File | null) => {
  if (!file) {
    throw new Error('No file provided to update profile photo.')
  }

  const formData = new FormData()
  formData.append('profilePictureURL', file)

  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/users/${id}/photo`,
      formData,
    )

    return response.data.profilePictureURL
  } catch (error) {
    console.error('Error updating profile photo:', error)
    throw error
  }
}

const removeProfilePhoto = async (id: string) => {
  try {
    await axios.delete(`${BASE_API_URL}/api/users/${id}/photo`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        console.log('No profile photo to remove.')
        return
      }
      console.error('Error removing profile photo:', error)
      throw error
    }
  }
}

export { fetchProfilePhoto, updateProfilePhoto, removeProfilePhoto }
