import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { checkIsFavorite, toggleFavorite } from '../services'

const useFavorite = (tourId, user) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (user && user._id && tourId) {
        try {
          const status = await checkIsFavorite(user._id, tourId)
          setIsFavorite(status)
        } catch (error) {
          console.error("Couldn't fetch the favorite status", error)
        }
      }
    }

    fetchFavoriteStatus()
  }, [tourId, user])

  const handleToggleFavorite = useCallback(async () => {
    if (!user || !user._id || !tourId) return

    try {
      await toggleFavorite(user._id, tourId, isFavorite, false)
      setIsFavorite(!isFavorite)

      const message = isFavorite
        ? 'Removed from favorites'
        : 'Added to favorites'
      toast({
        title: message,
        status: isFavorite ? 'info' : 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Couldn't update the favorite status", error)
    }
  }, [isFavorite, tourId, user, toast])

  return { isFavorite, handleToggleFavorite }
}

export default useFavorite
