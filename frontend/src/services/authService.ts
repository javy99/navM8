import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_API_URL = import.meta.env.VITE_API_URL

const loginService = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    )

    // Update token in cookies
    Cookies.set('token', response.data.token)

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const refreshToken = Cookies.get('refreshToken')
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              `${BASE_API_URL}/api/auth/refresh_token`,
              {},
              {
                withCredentials: true,
              },
            )
            // Update access token in cookies
            Cookies.set('token', refreshResponse.data.token, {})
            return await loginService(email, password)
          } catch (refreshError: any) {
            throw new Error(
              refreshError.response?.data.error || 'Failed to refresh token',
            )
          }
        } else {
          throw new Error('Refresh token is missing')
        }
      }
      throw new Error(
        error.response?.data.error || 'An error occurred during login',
      )
    }
    throw new Error('An error occurred during login')
  }
}

const signupService = async (
  email: string,
  password: string,
  username: string,
): Promise<any> => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/api/auth/signup`,
      {
        email,
        password,
        username,
      },
      {
        withCredentials: true,
      },
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

const logoutService = async (): Promise<void> => {
  try {
    await axios.post(
      `${BASE_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      },
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

const getUser = async (): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_API_URL}/api/auth/user`, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.error || 'An error occurred fetching user',
      )
    }
    throw new Error('An error occurred fetching user')
  }
}

export { loginService, signupService, logoutService, getUser }
