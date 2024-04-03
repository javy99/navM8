import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Text,
  Flex,
  Image,
  Icon,
  Button,
  Card as ChakraCard,
  CardHeader,
  CardBody,
  CardFooter,
  VStack,
  useTheme,
  Divider,
  Avatar,
} from '@chakra-ui/react'
import {
  BsStarFill,
  BsGeoAltFill,
  BsBookmarkHeartFill,
  BsPeopleFill,
  BsClockFill,
  BsCalendar2Fill,
  BsFillXCircleFill,
} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Tour } from '../types'
import { useAuthContext } from '../hooks'

type Props = {
  tour: Tour
  isFavoritePage?: boolean
  removeFromFavorites?: () => void
}

const TourCard: React.FC<Props> = ({
  tour,
  isFavoritePage = false,
  removeFromFavorites,
}) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const { state } = useAuthContext()
  const { user } = state
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const whiteColor = theme.colors.white

  // Customize icon colors here
  const favoriteIconColor = '#FF000F'
  const notFavoriteIconColor = 'gray.300'
  const removeIconColor = 'gray.500'

  const actionIcon = isFavoritePage ? BsFillXCircleFill : BsBookmarkHeartFill
  const iconColor = isFavoritePage
    ? removeIconColor
    : isFavorited
      ? favoriteIconColor
      : notFavoriteIconColor

  useEffect(() => {
    const checkIfFavorited = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/${user._id}/favoriteTours`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          const favorites = response.data
          const isFavorited = favorites.some(
            (favoriteTour) => favoriteTour._id === tour._id,
          )
          setIsFavorited(isFavorited)
        } catch (error) {
          console.error("Couldn't fetch the favorite status", error)
        }
      }
    }

    checkIfFavorited()
  }, [tour._id, user])

  const toggleFavorite = async (e) => {
    e.stopPropagation()
    if (!user) return

    let method = isFavorited ? 'delete' : 'post'
    if (isFavoritePage) {
      method = 'delete'
    }

    const url = isFavorited
      ? `${import.meta.env.VITE_API_URL}/api/users/${user._id}/favoriteTours/${tour._id}`
      : `${import.meta.env.VITE_API_URL}/api/users/${user._id}/favoriteTours`

    try {
      const config = {
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        ...(method === 'post' && { data: { tourId: tour._id } }),
      }

      await axios(config)

      if (isFavoritePage && method === 'delete') {
        // Remove the tour from favorites immediately from the UI
        if (removeFromFavorites) {
          removeFromFavorites() // Call the prop function to remove the tour from favorites
        }
      } else {
        setIsFavorited(!isFavorited)
      }
    } catch (error) {
      console.error("Couldn't update the favorite status", error)
    }
  }

  const openCardDetails = () => {
    navigate(`/guides/${tour._id}`)
  }

  return (
    <ChakraCard
      borderRadius="xl"
      width={{ base: '100%', md: '48%', '2xl': '30%' }}
      bg="#F6FBFC"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 4px 4px 0 #69490b',
      }}
      overflow="hidden"
      cursor="pointer"
      onClick={openCardDetails}
      boxShadow="0 4px 4px 0 #69490b"
    >
      <CardHeader p={0}>
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          style={{ width: '100%', height: '250px' }}
        >
          {tour.photos.map((photo, index) => (
            <SwiperSlide key={index}>
              <Image
                src={
                  typeof photo === 'string' ? photo : URL.createObjectURL(photo)
                }
                alt={`tour-${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </CardHeader>

      <CardBody pb={0}>
        <Text fontWeight="bold" fontSize="xl" mb={2} color={primaryColor}>
          {tour.name}
        </Text>
        <Flex align="center" fontSize="sm" mb={2}>
          <Icon as={BsGeoAltFill} mr={2} color="#EC502C" w={3} h={3} />
          <Text color={secondaryColor}>
            {tour.city}, {tour.country}
          </Text>
        </Flex>
        <Text fontSize="sm" color="#0B0006">
          {tour.description}
        </Text>
      </CardBody>

      <CardFooter>
        <VStack align="stretch" w="100%">
          <Flex align="center" fontSize="sm" mb={2}>
            <Icon as={BsPeopleFill} mr={3} color="#38A169" w={4} h={4} />
            <Text>
              <b>Max People:</b> {tour.maxPeople}{' '}
              {parseInt(tour.maxPeople, 10) === 1 ? 'person' : 'people'}
            </Text>
          </Flex>
          <Flex align="center" fontSize="sm" mb={2}>
            <Icon as={BsCalendar2Fill} mr={3} color="#E53E3E" w={4} h={4} />
            <Text>
              <b>Availability: </b>
              {tour.typeOfAvailability === 'recurring' ? (
                <>
                  {tour.availability === 'daily' ? 'Daily' : ''}
                  {tour.availability === 'weekends' ? 'On Weekends' : ''}
                  {tour.availability === 'weekdays' ? 'During Weekdays' : ''}
                </>
              ) : (
                new Date(tour.date).toLocaleDateString()
              )}
            </Text>
          </Flex>
          <Flex align="center" fontSize="sm" mb={2}>
            <Icon as={BsClockFill} mr={3} color="#E53E3E" w={4} h={4} />
            <Text>
              <b>Time: </b>
              {tour.from} - {tour.to}
            </Text>
          </Flex>
          <Flex align="center" fontSize="sm" mb={2}>
            <Icon as={BsStarFill} mr={3} color="#D69E2E" w={4} h={4} />
            <Text>
              <b>Rating:</b> 4.5
            </Text>
          </Flex>
          <Divider orientation="horizontal" width="100%" mb={2} />
          <Flex
            align="center"
            justifyContent="space-between"
            fontSize="sm"
            fontStyle="italic"
          >
            <Flex align="center">
              <Avatar
                color={whiteColor}
                key={tour.author._id}
                mr={2}
                size="sm"
                cursor="pointer"
                name={tour.author.username}
                src={tour.author.profilePictureURL}
                fontWeight={500}
              />
              <Text>
                By{' '}
                <b>
                  {tour.author.firstName} {tour.author.lastName}
                </b>
              </Text>
            </Flex>
            {user && (
              <Button
                size="sm"
                padding={0}
                onClick={toggleFavorite}
                _hover={{
                  bg: 'transparent',
                }}
                bg="transparent"
              >
                <Icon
                  as={actionIcon}
                  w={{ base: 6, '2xl': 7 }}
                  h={{ base: 6, '2xl': 7 }}
                  color={iconColor}
                />
              </Button>
            )}
          </Flex>
        </VStack>
      </CardFooter>
    </ChakraCard>
  )
}

export default TourCard
