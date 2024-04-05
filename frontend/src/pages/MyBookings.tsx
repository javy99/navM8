import {
  Box,
  Flex,
  Image,
  VStack,
  Heading,
  Text,
  useBreakpointValue,
  useTheme,
  ResponsiveValue,
  Spinner,
  // Spinner,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks'
import { BookingCard, Button } from '../components'
import myBookingsBg from '../assets/mybookings-bg.jpg'
import PageLayout from './PageLayout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Booking } from '../types'

type FlexDirection =
  | 'row'
  | 'column'
  | 'row-reverse'
  | 'column-reverse'
  | undefined

const MyBookings: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const navigate = useNavigate()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const whiteColor = theme.colors.white

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const bookingCardWidth = useBreakpointValue({ base: '100%', md: '48%' })
  const imageBoxSize = useBreakpointValue({ base: '100%', md: '50%' })
  const contentPadding = useBreakpointValue({
    base: '30px',
    md: '40px',
    lg: '50px',
  })

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        if (user && user.token) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/bookings/mybookings`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          if (response.status === 200) {
            setBookings(response.data)
          } else {
            // Handle error
            console.error('Failed to fetch bookings')
          }
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [user?.token])

  const flexDirection: ResponsiveValue<FlexDirection> = useBreakpointValue({
    base: 'column',
    md: 'row',
  })

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
        <VStack align="stretch" p={8} mt={{ base: 12, md: 0 }}>
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            My Bookings
          </Heading>
          {bookings.length > 0 ? (
            <Flex justifyContent="space-between" direction={flexDirection}>
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  width={bookingCardWidth}
                  tour={booking.tour}
                  date={booking.date}
                />
              ))}
            </Flex>
          ) : (
            <Box
              bg={whiteColor}
              borderRadius="20px"
              overflow="hidden"
              mx={12}
              border={`4px solid ${primaryColor}`}
            >
              <Flex justifyContent="space-between" direction={flexDirection}>
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="center"
                  p={contentPadding}
                  w={imageBoxSize}
                >
                  <Text
                    fontSize="xl"
                    fontWeight="semibold"
                    color={secondaryColor}
                    mb={5}
                  >
                    No trips booked...yet!
                  </Text>
                  <Text mb={5} color="#D1D0D0">
                    Time to dust off your bags and start planning your next
                    adventure
                  </Text>
                  <Button onClick={() => navigate('/')}>Start searching</Button>
                </Flex>
                <Box w={imageBoxSize}>
                  <Image
                    src={myBookingsBg}
                    alt="No bookings image"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
              </Flex>
            </Box>
          )}
          <Box width="100%" borderTop={`2px dashed ${secondaryColor}`} my={6} />
          <Box>
            <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
              Past Trips
            </Heading>
            <Flex flexWrap="wrap" justifyContent="space-between" mx={12}>
              {/*
            <BookingCard width={bookingCardWidth} />
            <BookingCard width={bookingCardWidth} />
            <BookingCard width={bookingCardWidth} />
            <BookingCard width={bookingCardWidth} />
      */}
            </Flex>
          </Box>
        </VStack>
      )}
    </PageLayout>
  )
}

export default MyBookings
