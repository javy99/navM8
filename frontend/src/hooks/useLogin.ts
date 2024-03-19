import { useState } from 'react'
import { useAuthContext } from '.'

const useLogin = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { dispatch } = useAuthContext()

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      )
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || 'An error occurred during login')
      }

      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })
      return true
    } catch (catchError) {
      if (catchError instanceof Error) setError(catchError.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, login, error }
}

export default useLogin
