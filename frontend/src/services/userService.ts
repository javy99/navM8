import axios from 'axios'
import { User } from '../types'

const BASE_API_URL = import.meta.env.VITE_API_URL

const fetchUserProfile = async (token: string, id: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user profile.')
  }
}

const updateUserProfile = async (token: string, id: string, userInfo: User) => {
  try {
    await axios.patch(`${BASE_API_URL}/api/users/${id}`, userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

const getAllUsers = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch users.')
  }
}

const checkIsFavorite = async (
  userId: string,
  tourId: string,
  token: string,
) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/api/users/${userId}/favoriteTours`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return response.data.some(
      (favoriteTour: any) => favoriteTour._id === tourId,
    )
  } catch (error) {
    console.error("Couldn't fetch the favorite status", error)
    throw error
  }
}

const toggleFavorite = async (
  userId: string,
  tourId: string,
  isFavorited: boolean,
  isFavoritePage: boolean,
  token: string,
) => {
  let method = isFavorited ? 'delete' : 'post'
  if (isFavoritePage) {
    method = 'delete'
  }

  const url = isFavorited
    ? `${BASE_API_URL}/api/users/${userId}/favoriteTours/${tourId}`
    : `${BASE_API_URL}/api/users/${userId}/favoriteTours`

  try {
    await axios({
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...(method === 'post' && { data: { tourId: tourId } }),
    })
  } catch (error) {
    console.error("Couldn't update the favorite status", error)
    throw error
  }
}

const getFavoriteTours = async (userId: string, token: string) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/api/users/${userId}/favoriteTours`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    throw new Error("Couldn't fetch favorite tours")
  }
}

export {
  getAllUsers,
  fetchUserProfile,
  updateUserProfile,
  checkIsFavorite,
  toggleFavorite,
  getFavoriteTours,
}
