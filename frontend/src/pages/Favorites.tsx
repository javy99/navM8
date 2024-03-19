import React, { useEffect, useState } from 'react'
import { Box, Flex, VStack, Heading, useTheme } from '@chakra-ui/react'
import axios from 'axios'
import { useAuthContext } from '../hooks'
import { Navbar, Sidebar, Card } from '../components'
import { Guide } from '../types'

const Favorites: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state

  const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([])
  const theme = useTheme()
  const primaryColor = theme.colors.primary

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
    <Flex minHeight="100vh" direction={{ base: 'column', md: 'row' }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <VStack align="stretch" p={8}>
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            Favorites
          </Heading>
          <Flex flexWrap="wrap" gap="32px">
            {featuredGuides.map((guide) => (
              <Box key={guide.id}>
                <Card guide={guide} user={user} />
              </Box>
            ))}
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  )
}

export default Favorites
