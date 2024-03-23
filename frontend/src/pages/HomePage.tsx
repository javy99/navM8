import React, { useState, useEffect } from 'react'
import { Flex, Text, Box, useTheme } from '@chakra-ui/react'
import axios from 'axios'
import { SearchBar, Card, BookingCard } from '../components'
import HeaderBgImage from '../assets/hero-bg6.jpg'
import { Guide } from '../types'
import { useAuthContext } from '../hooks'
import PageLayout from './PageLayout'

const HomePage: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state

  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([])

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_API_URL}/guides`)
      .then((response) => {
        setFeaturedGuides(response.data)
      })
      .catch((error) => {
        console.error('Error fetching featured guides:', error)
      })
  }, [])

  return (
    <PageLayout user={user}>
      <Box
        bgImage={`linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${HeaderBgImage})`}
        bgSize="cover"
        bgPosition="center"
        color="white"
        py={20}
        px={4}
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
      <Flex direction={{ base: 'column', md: 'row' }} pb={5}>
        <Box p={8} flex="3" minW={{ md: '74%' }}>
          <Text fontSize="xl" mb={4} color={primaryColor} fontWeight="bold">
            The Most Popular Tours
          </Text>
          <Flex flexWrap="wrap" gap="32px">
            {featuredGuides.map((guide) => (
              <Box key={guide.id}>
                <Card guide={guide} user={user} />
              </Box>
            ))}
          </Flex>
        </Box>
        {user && (
          <>
            <Box
              display={{ base: 'none', md: 'block' }}
              minW={{ md: '2%' }}
              borderLeft="2px dashed"
              borderColor={secondaryColor}
              my={8}
            ></Box>
            <Box flex="1" minW={{ md: '24%' }} py={8}>
              <Text fontSize="xl" fontWeight="bold" mb={4} color={primaryColor}>
                My Bookings
              </Text>
              <BookingCard width="330px" />
              <BookingCard width="330px" />
              <BookingCard width="330px" />
              <BookingCard width="330px" />
            </Box>
          </>
        )}
      </Flex>
    </PageLayout>
  )
}

export default HomePage
