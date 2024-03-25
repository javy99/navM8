import axios from 'axios'
import { useAuthContext } from '../hooks'

const profilePhotoService = () => {
  const { state } = useAuthContext()
  const { user } = state

  const fetchProfilePhoto = async () => {
    if (!user || !user.token) {
      return null
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/photo`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
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

  const updateProfilePhoto = async (file: File | null) => {
    if (file === null) {
      return
    }

    const formData = new FormData()
    formData.append('profilePictureURL', file)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )

      return response.data.profilePictureURL
    } catch (error) {
      console.error('Error updating profile photo:', error)
      throw error
    }
  }

  const removeProfilePhoto = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/user/photo`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
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

  return { fetchProfilePhoto, updateProfilePhoto, removeProfilePhoto }
}

export default profilePhotoService
