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
  // Spinner,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks'
import { BookingCard, Button } from '../components'
import myBookingsBg from '../assets/mybookings-bg.jpg'
import PageLayout from './PageLayout'

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

  const bookingCardWidth = useBreakpointValue({ base: '100%', md: '48%' })
  const imageBoxSize = useBreakpointValue({ base: '100%', md: '50%' })
  const contentPadding = useBreakpointValue({
    base: '30px',
    md: '40px',
    lg: '50px',
  })

  const flexDirection: ResponsiveValue<FlexDirection> = useBreakpointValue({
    base: 'column',
    md: 'row',
  })

  return (
    <PageLayout user={user}>
      <VStack align="stretch" p={8} mt={{ base: 12, md: 0 }}>
        <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
          My Bookings
        </Heading>
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
        <Box width="100%" borderTop={`2px dashed ${secondaryColor}`} my={6} />
        <Box>
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            Past Trips
          </Heading>
          <Flex flexWrap="wrap" justifyContent="space-between" mx={12}>
            <BookingCard width={bookingCardWidth} />
            <BookingCard width={bookingCardWidth} />
            <BookingCard width={bookingCardWidth} />
            <BookingCard width={bookingCardWidth} />
          </Flex>
        </Box>
      </VStack>
    </PageLayout>
  )
}

export default MyBookings
