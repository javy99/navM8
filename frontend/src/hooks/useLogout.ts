import { useToast } from '@chakra-ui/react'
import { useAuthContext } from '.'
import { logoutService } from '../services'

const useLogout = () => {
  const toast = useToast()
  const { dispatch } = useAuthContext()

  const logout = async () => {
    try {
      await logoutService()

      dispatch({ type: 'LOGOUT', payload: null })

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error logging out',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  return { logout }
}

export default useLogout
