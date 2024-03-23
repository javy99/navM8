import { useState } from 'react'
import { CreateToastFnReturn } from '@chakra-ui/react'
import { User } from '../types'
import axios from 'axios'

const useProfileUpdate = (user: User | null, toast: CreateToastFnReturn) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateProfile = async (userInfo: User) => {
    setIsLoading(true)
    const updateProfileUrl = `${import.meta.env.VITE_API_URL}/auth/profile`

    try {
      await axios.patch(updateProfileUrl, userInfo, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })

      toast({
        title: 'Profile updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          'An error occurred while updating the profile.'
        toast({
          title: 'Error updating profile.',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else if (error instanceof Error) {
        toast({
          title: 'Error updating profile.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { updateProfile, isLoading }
}

export default useProfileUpdate
