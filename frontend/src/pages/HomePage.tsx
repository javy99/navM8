import React, { useState, useEffect } from 'react'
import { Flex, Text, Box, useTheme, Spinner } from '@chakra-ui/react'
import { SearchBar, BookingCard, TourCard } from '../components'
import HeaderBgImage from '../assets/hero-bg6.jpg'
import { Tour } from '../types'
import { useAuthContext } from '../hooks'
import PageLayout from './PageLayout'
import { getAllTours } from '../services'

const HomePage: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state

  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchFeaturedGuides = async () => {
      try {
        setIsLoading(true)
        if (!user || !user.token) return

        const tours = await getAllTours(user?.token)
        setTours(tours)
      } catch (error) {
        console.error('Failed to fetch guides:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedGuides()
  }, [user?.token])

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
            <SearchBar />
          </Box>
          <Flex direction={{ base: 'column', md: 'row' }} overflow="hidden">
            <Box p={8} flex="3" minW={{ md: '74%' }}>
              <Text fontSize="xl" mb={4} color={primaryColor} fontWeight="bold">
                The Most Popular Tours
              </Text>
              <Flex wrap={'wrap'} gap={{ base: 6, '2xl': 10 }}>
                {tours.map((tour) => (
                  <TourCard tour={tour} key={tour._id} />
                ))}
              </Flex>
            </Box>
            {user && (
              <>
                <Box
                  display={{ base: 'none', xl: 'block' }}
                  minW={{ md: '2%' }}
                  borderLeft="2px dashed"
                  borderColor={secondaryColor}
                  my={8}
                  pr={3}
                />
                <Box
                  flex="1"
                  minW="24%"
                  py={8}
                  display={{ base: 'none', xl: 'block' }}
                >
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    mb={4}
                    color={primaryColor}
                  >
                    My Bookings
                  </Text>
                  <BookingCard width="auto" />
                  <BookingCard width="auto" />
                  <BookingCard width="auto" />
                  <BookingCard width="auto" />
                </Box>
              </>
            )}
          </Flex>
        </>
      )}
    </PageLayout>
  )
}

export default HomePage
