import { useRef, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { useProfilePhoto } from '../context'

const usePhotoManager = () => {
  const { photo, updatePhoto, removePhoto } = useProfilePhoto()
  const toast = useToast()
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          updatePhoto(reader.result as string)
          toast({
            title: 'Photo added successfully.',
            description: 'Your new profile photo has been updated.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: 'No photo selected.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
      }
      event.target.value = ''
    },
    [updatePhoto, toast],
  )

  const handlePhotoRemoval = useCallback(() => {
    if (photo) {
      removePhoto()
      toast({
        title: 'Photo removed.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'No photo to remove.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [photo, removePhoto, toast])

  return {
    inputFileRef,
    handlePhotoChange,
    handlePhotoRemoval,
    photo,
  }
}

export default usePhotoManager
