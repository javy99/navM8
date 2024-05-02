import { Flex, Text, Box, useTheme, Spinner } from '@chakra-ui/react'
import { SearchBar, TourCard, PageLayout } from '../components'
import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks'
import { getAllTours } from '../services'
import { Tour } from '../types'
import HeaderBgImage from '../assets/home-bg.jpg'

const HomePage: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  const [allTours, setAllTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true)

        const tours = await getAllTours()
        setAllTours(tours)
        setFilteredTours(tours)
      } catch (error) {
        console.error('Failed to fetch guides:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTours()
  }, [user?.token])

  const handleSearch = (cityName: string) => {
    try {
      if (typeof cityName !== 'string') {
        throw new Error('City name should be a string')
      }

      // If cityName is empty, set filteredTours to allTours
      if (cityName.trim() === '') {
        setFilteredTours(allTours)
      } else {
        const filtered = allTours.filter(
          (tour) => tour.city.toLowerCase() === cityName.toLowerCase(),
        )
        setFilteredTours(filtered)
      }
    } catch (error) {
      console.error('Error searching tours by city:', error)
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
        <>
          <Box
            bgImage={`linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${HeaderBgImage})`}
            bgSize="cover"
            bgPosition="center"
            color="white"
            py={20}
            px={4}
            mt={{ base: 12, md: 0 }}
            textAlign="center"
          >
            <Text fontSize="3xl" fontWeight="bold" mb={4}>
              Welcome to Your Next Adventure!
            </Text>
            <Text fontSize="lg">
              Explore, Discover, and Plan Your Perfect Getaway
            </Text>
            <SearchBar onSearch={handleSearch} />
          </Box>
          <Flex direction={{ base: 'column', md: 'row' }} overflow="hidden">
            <Box p={8} flex="3" minW={{ md: '74%' }}>
              <Text fontSize="xl" mb={4} color={primaryColor} fontWeight="bold">
                The Most Popular Tours
              </Text>
              <Flex wrap={'wrap'} gap={{ base: 6, '2xl': 10 }}>
                {filteredTours.map((tour) => (
                  <TourCard tour={tour} key={tour._id} />
                ))}
              </Flex>
            </Box>
          </Flex>
        </>
      )}
    </PageLayout>
  )
}

export default HomePage
