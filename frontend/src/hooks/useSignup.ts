import { useState } from 'react'
import { useAuthContext } from '.'
import { signupService } from '../services'
import { useToast } from '@chakra-ui/react'
// import Cookies from 'js-cookie'

const useSignup = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { dispatch } = useAuthContext()
  const toast = useToast()

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const json = await signupService(email, password, username)

      // Update token in cookies
      // Cookies.set('token', json.token, {
      //   expires: 3,
      //   secure: true,
      //   httpOnly: true,
      //   sameSite: 'strict',
      // })

      dispatch({ type: 'LOGIN', payload: json })

      toast({
        title: 'Account created.',
        description: "You're successfully signed up.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      return true
    } catch (catchError) {
      if (catchError instanceof Error) {
        setError(catchError.message)
        toast({
          title: 'Error signing up.',
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

  return { isLoading, signup, error }
}

export default useSignup
