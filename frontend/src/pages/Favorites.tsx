import React, { useEffect, useState } from 'react'
import { Flex, VStack, Heading, useTheme, Spinner, Box } from '@chakra-ui/react'
import { TourCard, PageLayout } from '../components'
import { getFavoriteTours } from '../services'
import { useAuthContext } from '../hooks'
import { Tour } from '../types'

const Favorites: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [favoriteTours, setFavoriteTours] = useState<Tour[]>([])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && user._id) {
        try {
          setIsLoading(true)
          const data = await getFavoriteTours(user._id)
          setFavoriteTours(data)
        } catch (error) {
          console.error("Couldn't fetch favorite tours", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchFavorites()
  }, [user])

  const removeFromFavorites = (tourId?: string) => {
    if (tourId) {
      setFavoriteTours(favoriteTours.filter((tour) => tour._id !== tourId))
    }
  }

  return (
    <PageLayout user={user}>
      {isLoading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Spinner
            size="xl"
            color={primaryColor}
            thickness="5px"
            speed="1s"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
          />
        </Box>
      ) : (
        <VStack align="stretch" mt={{ base: 12, md: 0 }} p={8}>
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            Favorites
          </Heading>
          <Flex wrap={'wrap'} gap={{ base: 6, lg: 8, '2xl': 10 }}>
            {favoriteTours.map((tour) => (
              <TourCard
                key={tour._id}
                tour={tour}
                isFavoritePage={true}
                removeFromFavorites={() => removeFromFavorites(tour._id)}
              />
            ))}
          </Flex>
        </VStack>
      )}
    </PageLayout>
  )
}

export default Favorites
