import axios from 'axios'
const BASE_API_URL = import.meta.env.VITE_API_URL

// Function to refresh token
const refreshToken = async () => {
  if (!refreshToken) throw new Error('Refresh token is missing')

  const response = await axios.post(
    `${BASE_API_URL}/api/auth/refresh_token`,
    {},
    { withCredentials: true },
  )

  return response.data.token
}

const loginService = async (email, password) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true },
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.error || 'An error occurred during login',
      )
    }
    throw new Error('An error occurred during login')
  }
}

const signupService = async (email, password, username) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/auth/signup`,
      { email, password, username },
      { withCredentials: true },
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.error || 'An error occurred during signup',
      )
    }
    throw new Error('An error occurred during signup')
  }
}

const logoutService = async () => {
  try {
    await axios.post(
      `${BASE_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true },
    )
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.error || 'An error occurred during logout',
      )
    }
    throw new Error('An error occurred during logout')
  }
}

const getUser = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/auth/user`, {
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        try {
          const newToken = await refreshToken()
          const response = await axios.get(`${BASE_API_URL}/api/auth/user`, {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
            withCredentials: true,
          })
          return response.data
        } catch (refreshError) {
          throw new Error('Session expired. Please login again.')
        }
      }
      throw new Error(
        error.response?.data.error || 'An error occurred fetching user',
      )
    }
    throw new Error('An error occurred fetching user')
  }
}

export { loginService, signupService, logoutService, getUser }
