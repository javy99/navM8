import { useState } from 'react'
import { useAuthContext } from '.'

const useSignup = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { dispatch } = useAuthContext()

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, username }),
        },
      )
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || 'An error occurred during signup')
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

  return { isLoading, signup, error }
}

export default useSignup
