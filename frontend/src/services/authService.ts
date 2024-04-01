import axios from 'axios'

const loginService = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        email,
        password,
      },
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

const signupService = async (
  email: string,
  password: string,
  username: string,
): Promise<any> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/signup`,
      {
        email,
        password,
        username,
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

export { loginService, signupService }
