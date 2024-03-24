// useSignup.ts
import { useState } from 'react'
import { useAuthContext } from '.'
import { signupService } from '../services'

const useSignup = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { dispatch } = useAuthContext()

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const json = await signupService(email, password, username)

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
