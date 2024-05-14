import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@chakra-ui/react'
import { BookingCard, Button, PageLayout } from '../components'
import { useAuthContext } from '../hooks'
import { fetchBookings } from '../services'
import { Booking } from '../types'
import myBookingsBg from '../assets/mybookings-bg.jpg'

type FlexDirection =
  | 'row'
  | 'column'
  | 'row-reverse'
  | 'column-reverse'
  | undefined

const MyBookings: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const whiteColor = theme.colors.white

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])

  const bookingCardWidth = useBreakpointValue({ base: '100%', md: '48%' })
  const imageBoxSize = useBreakpointValue({ base: '100%', md: '50%' })
  const contentPadding = useBreakpointValue({
    base: '30px',
    md: '40px',
    lg: '50px',
  })

  useEffect(() => {
    const getBookings = async () => {
      setIsLoading(true)
      try {
        if (user) {
          const fetchedBookings = await fetchBookings()

          const now = new Date()

          const current = fetchedBookings.filter(
            (booking) =>
              new Date(booking.date) >= now && booking.status !== 'COMPLETED',
          )
          const past = fetchedBookings.filter(
            (booking) =>
              new Date(booking.date) < now || booking.status === 'COMPLETED',
          )
          setCurrentBookings(current)
          setPastBookings(past)
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getBookings()
  }, [user])

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
          {currentBookings.length > 0 ? (
            <Flex
              justifyContent="space-between"
              direction={flexDirection}
              flexWrap="wrap"
              gap={{ base: 4, md: 6, lg: 8 }}
            >
              {currentBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  width={bookingCardWidth}
                  tour={booking.tour}
                  date={booking.date}
                  status={booking.status}
                  bookingId={booking._id}
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
            {pastBookings.length > 0 ? (
              <Flex
                justifyContent="space-between"
                direction={flexDirection}
                flexWrap="wrap"
                gap={{ base: 4, md: 6, lg: 8 }}
              >
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    width={bookingCardWidth}
                    tour={booking.tour}
                    date={booking.date}
                    status={booking.status}
                    bookingId={booking._id}
                  />
                ))}
              </Flex>
            ) : (
              <Text fontWeight="bold" color="red.500" textTransform="uppercase">
                No past trips!
              </Text>
            )}
          </Box>
        </VStack>
      )}
    </PageLayout>
  )
}

export default MyBookings
