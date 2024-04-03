import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Flex, VStack, Heading, useTheme, Spinner, Box } from '@chakra-ui/react'
import { useAuthContext } from '../hooks'
import TourCard from '../components/TourCard' // Ensure this import points to your TourCard component
import PageLayout from './PageLayout'

const Favorites: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state

  const [favoriteTours, setFavoriteTours] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          setIsLoading(true)
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/${user._id}/favoriteTours`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
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

  const removeFromFavorites = (tourId: string) => {
    setFavoriteTours(favoriteTours.filter((tour) => tour._id !== tourId))
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
          <Flex wrap={'wrap'} gap={{ base: 6, '2xl': 10 }}>
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
