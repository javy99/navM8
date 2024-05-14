import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Text,
  Flex,
  Image,
  Icon,
  Card as ChakraCard,
  CardHeader,
  CardBody,
  CardFooter,
  VStack,
  useTheme,
  Divider,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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
import { Review, Tour } from '../types'
import { useAuthContext, useFavorite } from '../hooks'
import Button from './Button'
import { fetchReviews } from '../services'

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
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const whiteColor = theme.colors.white

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { isFavorite, handleToggleFavorite } = useFavorite(tour._id, user)

  const [reviews, setReviews] = useState<Review[]>([])

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
    if (
      user &&
      tour._id &&
      tour &&
      typeof tour.reviewCount === 'number' &&
      tour.reviewCount > 0
    ) {
      fetchReviews(tour._id)
        .then(setReviews)
        .catch((error) => console.error('Error fetching reviews:', error))
    }
  }, [tour._id, tour])

  const handleToggleFavoriteClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    await handleToggleFavorite()
    if (isFavorite && removeFromFavorites) {
      removeFromFavorites()
    }
  }

  const openCardDetails = () => {
    if (user) {
      navigate(`/tours/${tour._id}`)
    } else {
      setIsModalOpen(true)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleLoginClick = () => {
    navigate('/login')
    handleModalClose()
  }

  const handleSignupClick = () => {
    navigate('/signup')
    handleModalClose()
  }

  return (
    <>
      <ChakraCard
        borderRadius="10px"
        width={{ base: '100%', md: '48%', lg: '31%', '2xl': '23%' }}
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
                    typeof photo === 'string'
                      ? photo
                      : URL.createObjectURL(photo)
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
                <b>Rating:</b>{' '}
                {reviews.length > 0
                  ? (
                      reviews.reduce((acc, review) => acc + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : 'No reviews yet'}
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
                  onClick={handleToggleFavoriteClick}
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
      <Modal isOpen={isModalOpen} onClose={handleModalClose} isCentered={true}>
        <ModalOverlay bg="rgba(0,0,0,0.5)" />
        <ModalContent
          borderBottom="10px solid"
          borderColor={primaryColor}
          borderRadius="10px"
          overflow="hidden"
        >
          <ModalHeader
            bg="#F6FBFC"
            boxShadow="xl"
            color={primaryColor}
            fontWeight="bold"
          >
            Sign up or Log in
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <Text>
              You need to sign up or log in to see details of the tour.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleLoginClick}>
              Log in
            </Button>
            <Button onClick={handleSignupClick}>Sign up</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TourCard
