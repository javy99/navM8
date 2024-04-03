import axios from 'axios'
import { User } from '../types'

export const fetchUserProfile = async (token: string, id: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user profile.')
  }
}

export const updateUserProfile = async (
  token: string,
  id: string,
  userInfo: User,
) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/users/${id}`,
      userInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          'An error occurred while updating profile.',
      )
    } else if (error instanceof Error) {
      throw new Error(error.message)
    }
  }
}

export const getAllUsers = async (token: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch users.')
  }
}
