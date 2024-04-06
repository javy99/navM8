import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  useToast,
} from '@chakra-ui/react'
import {
  BsStarFill,
  BsGeoAltFill,
  BsBookmarkHeartFill,
  BsCalendar2Fill,
  BsBookmarkXFill,
} from 'react-icons/bs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Tour } from '../types'
import { useAuthContext } from '../hooks'
import { checkIsFavorite, toggleFavorite } from '../services'

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
  const navigate = useNavigate()
  const theme = useTheme()
  const { state } = useAuthContext()
  const { user } = state
  const toast = useToast()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const whiteColor = theme.colors.white

  const [isFavorite, setIsFavorite] = useState<boolean>(false)

  const favoriteIconColor = '#FF000F'
  const notFavoriteIconColor = 'gray.300'
  const removeIconColor = 'gray.700'

  const actionIcon = isFavoritePage ? BsBookmarkXFill : BsBookmarkHeartFill
  const iconColor = isFavoritePage
    ? removeIconColor
    : isFavorite
      ? favoriteIconColor
      : notFavoriteIconColor

  useEffect(() => {
    if (!user || !user._id || !user.token || !tour._id) {
      console.error('Missing required data')
      return
    }

    checkIsFavorite(user._id, tour._id, user.token)
      .then(setIsFavorite)
      .catch((error) =>
        console.error("Couldn't fetch the favorite status", error),
      )
  }, [tour, user])

  const handleToggleFavorite = async (e) => {
    e.stopPropagation()

    if (!user || !user._id || !user.token || !tour._id) return

    try {
      await toggleFavorite(
        user._id,
        tour._id,
        isFavorite,
        isFavoritePage,
        user.token,
      )

      if (isFavoritePage && removeFromFavorites) {
        removeFromFavorites()
        toast({
          title: 'Removed from favorites',
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
      } else {
        setIsFavorite(!isFavorite)
        toast({
          title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
          status: isFavorite ? 'info' : 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error("Couldn't update the favorite status", error)
    }
  }

  const openCardDetails = () => {
    navigate(`/${tour._id}`)
  }

  return (
    <ChakraCard
      borderRadius="xl"
      width={
        isFavoritePage
          ? { base: '100%', md: '48%', xl: '31%', '2xl': '23%' }
          : { base: '100%', md: '48%', '2xl': '31%' }
      }
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
                onClick={handleToggleFavorite}
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
