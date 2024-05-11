import { useState } from 'react'
import { useAuthContext } from '.'
import { loginService } from '../services'
import { useToast } from '@chakra-ui/react'

const useLogin = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { dispatch } = useAuthContext()
  const toast = useToast()

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const json = await loginService(email, password)

      dispatch({ type: 'LOGIN', payload: json })

      toast({
        title: 'Login successful.',
        description: "You're now logged in.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      return true
    } catch (catchError) {
      if (catchError instanceof Error) {
        setError(catchError.message)
        toast({
          title: 'Error logging in.',
          description: catchError.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, login, error }
}

export default useLogin
