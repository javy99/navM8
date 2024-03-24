import { useState } from 'react'
import { useAuthContext } from '.'
import { loginService } from '../services'

const useLogin = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { dispatch } = useAuthContext()

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const json = await loginService(email, password)

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
