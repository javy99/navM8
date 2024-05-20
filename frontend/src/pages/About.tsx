import React, { useEffect, useState } from 'react'
import {
  VStack,
  Heading,
  useTheme,
  Text,
  Box,
  Icon,
  SimpleGrid,
  Spinner,
  HStack,
  Divider,
} from '@chakra-ui/react'
import { FaCheckCircle, FaUserFriends } from 'react-icons/fa'
import { MdTravelExplore } from 'react-icons/md'
import { FcCheckmark, FcExpired } from 'react-icons/fc'
import { useAuthContext } from '../hooks'
import { PageLayout } from '../components'
import { getAllTours, getAllUsers } from '../services'

const About: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  const [userCount, setUserCount] = useState<number>(0)
  const [tourCount, setTourCount] = useState<number>(0)
  const [expiredTourCount, setExpiredTourCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    Promise.all([
      getAllUsers().then((users) => {
        setUserCount(users.length)
      }),
      getAllTours().then((tours) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const validTours = tours.filter((tour) => {
          if (tour.typeOfAvailability === 'one-time') {
            const tourDate = new Date(tour.date)
            tourDate.setHours(0, 0, 0, 0)
            return tourDate >= today
          }
          return true
        })

        const expiredTours = tours.filter((tour) => {
          if (tour.typeOfAvailability === 'one-time') {
            const tourDate = new Date(tour.date)
            tourDate.setHours(0, 0, 0, 0)
            return tourDate < today
          }
          return false
        })

        setTourCount(validTours.length)
        setExpiredTourCount(expiredTours.length)
      }),
    ])
      .catch((error) => {
        console.error('Failed to fetch data:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const boxBg = `linear-gradient(135deg, ${theme.colors.gray[100]}, ${theme.colors.gray[300]})`

  const stats = [
    {
      icon: FaUserFriends,
      value: userCount,
      label: 'Users',
    },
    {
      icon: MdTravelExplore,
      value: tourCount,
      label: 'Active Tours',
    },
    {
      icon: FcExpired,
      value: expiredTourCount,
      label: 'Expired Tours',
    },
  ]

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
            About & How-to
          </Heading>
          <SimpleGrid columns={{ sm: 1, lg: 3, '2xl': 4 }} spacing={5} mb={4}>
            {stats.map((stat) => (
              <Box
                key={stat.label}
                p={5}
                boxShadow="lg"
                borderRadius="lg"
                textAlign="center"
                bg={boxBg}
              >
                <Icon
                  as={stat.icon}
                  w={10}
                  h={10}
                  color={primaryColor}
                  mb={2}
                />
                <Text fontSize="3xl" mb={3}>
                  {stat.value}
                </Text>
                <Text fontSize="md" textTransform="uppercase">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
          <Text fontSize="lg" my={6}>
            <b>navM8</b>, short for <b>"navigator mate,"</b> is your go-to
            platform for authentic travel experiences. We connect travelers with
            knowledgeable locals who offer personalized tours, making
            exploration affordable and enriching.
          </Text>
          <Divider mb={6} />
          <Heading as="h4" fontSize="1.2rem" color={primaryColor} mb={4}>
            Features
          </Heading>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={5} mb={6}>
            <HStack>
              <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
              <Text>Browse tours by destination.</Text>
            </HStack>
            <HStack>
              <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
              <Text>Message local guides to customize your experience.</Text>
            </HStack>
            <HStack>
              <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
              <Text>Enjoy a personalized tour with a passionate local.</Text>
            </HStack>
            <HStack>
              <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
              <Text>
                Accessible to all, whether you're a seasoned traveler or
                first-time adventurer.
              </Text>
            </HStack>
          </SimpleGrid>
          <Divider mb={6} />
          <Heading as="h4" fontSize="1.2rem" color={primaryColor} mb={4}>
            Authorized User Functionalities
          </Heading>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={5} mb={6}>
            <HStack align="start">
              <Icon as={FcCheckmark} w={6} h={6} />
              <Text>
                <b>Profile Customization:</b> Update your profile with personal
                information to enhance interactions.
              </Text>
            </HStack>
            <HStack align="start">
              <Icon as={FcCheckmark} w={6} h={6} />
              <Text>
                <b>Create and Manage Tours:</b> Design your own tours, set
                schedules, and manage bookings with ease.
              </Text>
            </HStack>
            <HStack align="start">
              <Icon as={FcCheckmark} w={6} h={6} />
              <Text>
                <b>Review and Ratings:</b> Share your experiences and read
                reviews from other travelers to ensure you choose the best
                guides and tours.
              </Text>
            </HStack>
            <HStack align="start">
              <Icon as={FcCheckmark} w={6} h={6} />
              <Text>
                <b>Advanced Messaging:</b> Enjoy direct communication with
                guides, allowing for detailed customization of your travel
                plans.
              </Text>
            </HStack>
            <HStack align="start">
              <Icon as={FcCheckmark} w={6} h={6} />
              <Text>
                <b>Access to Bookings:</b> View and manage all current and past
                bookings efficiently.
              </Text>
            </HStack>
            <HStack align="start">
              <Icon as={FcCheckmark} w={6} h={6} />
              <Text>
                <b>Favorite Tours:</b> Save appealing tours to your Favorites
                for quick access in the future.
              </Text>
            </HStack>
          </SimpleGrid>
        </VStack>
      )}
    </PageLayout>
  )
}

export default About
