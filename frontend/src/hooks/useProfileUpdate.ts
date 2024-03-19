import { useState } from 'react'
import { CreateToastFnReturn } from '@chakra-ui/react'
import { User } from '../types'

const useProfileUpdate = (user: User | null, toast: CreateToastFnReturn) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateProfile = async (userInfo: User) => {
    setIsLoading(true)
    const updateProfileUrl = `${import.meta.env.VITE_API_URL}/auth/profile`

    try {
      const response = await fetch(updateProfileUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(userInfo),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Profile updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        throw new Error(
          data.error || 'An error occurred while updating the profile.'
        )
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          toast({
            title: 'Error updating profile.',
            description:
              'Failed to fetch: The request cannot be made. Possibly a network error or CORS issue.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        } else if (error.message) {
          toast({
            title: 'Error updating profile.',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { updateProfile, isLoading }
}

export default useProfileUpdate
