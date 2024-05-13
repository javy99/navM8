import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Text,
  Flex,
  Box,
  Image,
  Icon,
  Card,
  useTheme,
  CardBody,
  Heading,
  Stack,
  Badge,
} from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { BsCalendar4, BsGeoAltFill, BsPeopleFill } from 'react-icons/bs'
import { Tour } from '../types'

type Props = {
  width: string | undefined
  tour: Tour
  date: string
  status: string
}

const BookingCard: React.FC<Props> = ({ width, tour, date, status }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary

  const openCardDetails = () => {
    navigate(`/tours/${tour._id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'red'
      case 'CONFIRMED':
        return 'green'
      case 'CANCELLED':
        return 'gray'
      case 'COMPLETED':
        return 'blue'
      default:
        return 'gray'
    }
  }

  if (!tour) {
    return null
  }

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
      borderRadius="10px"
      width={width}
      bg="#F6FBFC"
      boxShadow="0 4px 4px 0 #69490b"
      cursor="pointer"
      onClick={openCardDetails}
      position="relative"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 4px 4px 0 #69490b',
      }}
    >
      {tour.photos && tour.photos.length > 0 && (
        <Box
          maxW={{ base: '100%', sm: '200px' }}
          overflow="hidden"
          objectFit="cover"
        >
          <Swiper
            modules={[Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            {tour.photos.map((photo, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={photo as string}
                  alt={`tour-${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
      <Stack>
        <CardBody>
          <Heading size="md" color={primaryColor}>
            {tour.name}
          </Heading>

          {/* <Text py={3}>{tour.description}</Text> */}
          <Flex pt={3} alignItems="center">
            <Icon as={BsCalendar4} color="#EC502C" w={5} h={5} />
            <Text ml={2} color={secondaryColor}>
              {date.toLocaleString().split('T')[0]}
            </Text>
          </Flex>
          <Flex py={3}>
            <Icon as={BsGeoAltFill} color="#EC502C" w={5} h={5} />
            <Text ml={2} color={secondaryColor}>
              {tour.country}, {tour.city}
            </Text>
          </Flex>
          <Flex>
            <Icon as={BsPeopleFill} color={primaryColor} w={5} h={5} />
            <Text ml={2} color={secondaryColor}>
              {tour.maxPeople}{' '}
              {parseInt(tour.maxPeople, 10) === 1 ? 'person' : 'people'}
            </Text>
          </Flex>
        </CardBody>
        <Flex position="absolute" bottom={3} right={3}>
          <Badge
            colorScheme={getStatusColor(status)}
            variant="outline"
            fontSize={{ base: 'xs', '2xl': 'sm' }}
            fontWeight="bold"
          >
            {status}
          </Badge>
        </Flex>
      </Stack>
    </Card>
  )
}

export default BookingCard
