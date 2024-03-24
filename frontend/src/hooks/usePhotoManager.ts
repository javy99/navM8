import { useRef, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { useProfilePhoto } from '../context'

const usePhotoManager = () => {
  const { photo, updatePhoto } = useProfilePhoto()
  const toast = useToast()
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (photo !== null) {
        toast({
          title: 'Existing photo detected.',
          description:
            'Please remove the current photo before uploading a new one.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
      } else if (file) {
        try {
          await updatePhoto(file)
          toast({
            title: 'Photo updated successfully.',
            description: 'Your profile photo has been updated.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
        } catch (error) {
          toast({
            title: 'Failed to update photo.',
            description: 'An error occurred while updating your profile photo.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      }
      event.target.value = ''
    },
    [updatePhoto, toast],
  )

  const handlePhotoRemoval = useCallback(async () => {
    if (photo === null) {
      toast({
        title: 'No photo to remove.',
        description: 'There is no profile photo currently set.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    } else {
      try {
        await updatePhoto(null)
        toast({
          title: 'Photo removed successfully.',
          description: 'Your profile photo has been removed.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } catch (error) {
        toast({
          title: 'Failed to remove photo.',
          description: 'An unexpected error occurred.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }, [updatePhoto, toast, photo])

  return { photo, inputFileRef, handlePhotoChange, handlePhotoRemoval }
}

export default usePhotoManager
