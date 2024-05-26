import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { fetchUserProfile, toggleFavorite } from '../services'
import { Tour } from '../types'

const useFavorite = (tourId, user) => {
  const [favoriteTours, setFavoriteTours] = useState<Tour[]>([])
  const toast = useToast()

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (user && user._id) {
        try {
          const profile = await fetchUserProfile(user._id)
          setFavoriteTours(profile.favoriteTours || [])
        } catch (error) {
          console.error("Couldn't fetch user profile", error)
        }
      }
    }

    fetchFavoriteStatus()
  }, [tourId, user])

  const isFavorite = favoriteTours.includes(tourId)

  const handleToggleFavorite = useCallback(async () => {
    if (!user || !user._id || !tourId) return

    try {
      await toggleFavorite(user._id, tourId, isFavorite, false)
      setFavoriteTours((prev) =>
        isFavorite ? prev.filter((id) => id !== tourId) : [...prev, tourId],
      )

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
