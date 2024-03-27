import { useToast } from '@chakra-ui/react'
import { useAuthContext } from '.'

const useLogout = () => {
  const toast = useToast()
  const { dispatch } = useAuthContext()

  const logout = async () => {
    localStorage.removeItem('user')

    dispatch({ type: 'LOGOUT', payload: null })

    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  return { logout }
}

export default useLogout
