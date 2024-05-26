import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import {
  Box,
  Flex,
  Image,
  Text,
  Spinner,
  useTheme,
  VStack,
  Heading,
  Avatar,
  Icon,
  Divider,
  useToast,
  Badge,
  Tooltip,
} from '@chakra-ui/react'
import {
  BsCalendar2Minus,
  BsCalendarCheck,
  BsClock,
  BsGeoAltFill,
  BsPeople,
  BsHeart,
  BsHeartFill,
} from 'react-icons/bs'
import { format, startOfDay } from 'date-fns'
import axios from 'axios'
import {
  getTourById,
  fetchBookings,
  createBooking,
  cancelBooking,
  fetchReviews,
  fetchUserProfile,
} from '../services'
import { Button, PageLayout, StarRating, ReviewForm } from '../components'
import { useAuthContext, useFavorite } from '../hooks'
import { Tour, Booking, Review } from '../types'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

const TourDetails: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const toast = useToast()
  const theme = useTheme()
  const { id, bookingId } = useParams()
  const whiteColor = theme.colors.white
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary

  const { isFavorite, handleToggleFavorite } = useFavorite(id, user)
  const navigate = useNavigate()

  const [reviews, setReviews] = useState<Review[]>([])
  const [value, onChange] = useState<Value>(new Date())
  const [isBooked, setIsBooked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tourDetails, setTourDetails] = useState<Tour | undefined>()
  const [bookingDate, setBookingDate] = useState<string | null>(null)
  const [bookingStatus, setBookingStatus] = useState<string | null>(null)
  const [currentTourBooking, setCurrentTourBooking] = useState<Booking | null>(
    null,
  )

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (user && id && user._id) {
          const tourData = await getTourById(id)
          setTourDetails(tourData)

          const bookings = await fetchBookings()
          const tourBooking = bookings.find(
            (booking) => booking._id === bookingId,
          )
          if (tourBooking) {
            setIsBooked(true)
            setBookingStatus(tourBooking.status)
            setBookingDate(new Date(tourBooking.date).toLocaleDateString())
            setCurrentTourBooking(tourBooking)
          } else {
            setIsBooked(false)
            setBookingStatus(null)
            setBookingDate(null)
            setCurrentTourBooking(null)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, user])

  useEffect(() => {
    const fetchTourReviews = async () => {
      if (
        user &&
        user.token &&
        id &&
        tourDetails &&
        typeof tourDetails.reviewCount === 'number' &&
        tourDetails.reviewCount > 0
      ) {
        try {
          const reviewsData = await fetchReviews(id)
          setReviews(reviewsData)
        } catch (error) {
          console.error('Error fetching reviews:', error)
        }
      }
    }

    fetchTourReviews()
  }, [id, user?.token, tourDetails])

  const handleBooking = async () => {
    if (!user || !id || !value || !user._id) {
      toast({
        title: 'Please log in and select a date to book this tour.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      const userProfile = await fetchUserProfile(user._id)
      if (
        !userProfile.firstName ||
        !userProfile.lastName ||
        !userProfile.email ||
        !userProfile.city ||
        !userProfile.country
      ) {
        toast({
          title: 'Please complete your profile to book this tour.',
          description: 'Redirecting to your profile page...',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        })

        setTimeout(() => {
          window.location.href = '/profile'
        }, 3000)

        return
      }

      const bookingDate = Array.isArray(value) ? value[0] : value
      if (!bookingDate) {
        toast({
          title: 'Please select a date to book this tour.',
          status: 'warning',
          duration: 2000,
          isClosable: true,
        })
        return
      }

      const bookingDateISO = format(bookingDate, 'yyyy-MM-dd')

      const booking = await createBooking(id, bookingDateISO)
      toast({
        title: 'Booking successful!',
        description: 'Your tour has been booked.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setTimeout(() => {
        navigate('/bookings')
      }, 1000)

      setIsBooked(true)
      setBookingStatus('PENDING')
      setBookingDate(new Date(booking.date).toLocaleDateString())
      setCurrentTourBooking(booking)

      toast({
        title: 'Booking successful!',
        description: 'Your tour has been booked.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => {
          navigate('/bookings')
        },
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: error.response?.data?.error || 'An error occurred',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!user || !id || !currentTourBooking) {
      toast({
        title: 'Please log in to cancel this booking.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      await cancelBooking(bookingId)

      setIsBooked(false)
      setBookingStatus(null)
      setCurrentTourBooking(null)

      toast({
        title: 'Booking canceled successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: error.response?.data?.error || 'An error occurred',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
    }
  }

  const onSubmitReview = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview])
    toast({
      title: 'Review Added',
      description: 'Your review has been added successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

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
        tourDetails && (
          <VStack align="stretch" mt={{ base: 12, md: 0 }} p={8}>
            <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
              {tourDetails.name}
            </Heading>
            <Flex align="center" mb={4} justifyContent="space-between">
              <Flex align="center">
                <Avatar
                  color={whiteColor}
                  key={tourDetails.author._id}
                  mr={2}
                  size="md"
                  cursor="pointer"
                  name={tourDetails.author.username}
                  src={tourDetails.author.profilePictureURL}
                  fontWeight={500}
                />
                <Tooltip
                  label={`View ${tourDetails.author.firstName}'s Profile`}
                  hasArrow
                  placement="bottom-end"
                >
                  <Text fontStyle="italic">
                    By{' '}
                    <Link to={`/users/${tourDetails.author._id}`}>
                      <b>
                        {tourDetails.author.firstName}{' '}
                        {tourDetails.author.lastName}
                      </b>
                    </Link>
                  </Text>
                </Tooltip>
              </Flex>
              <Box
                width="50px"
                height="50px"
                border={`1px dashed ${isFavorite ? '#E53E3E' : 'gray'}`}
                borderRadius="50%"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {isFavorite ? (
                  <BsHeartFill
                    size="1.2em"
                    color="#E53E3E"
                    cursor="pointer"
                    onClick={handleToggleFavorite}
                  />
                ) : (
                  <BsHeart
                    size="1.2em"
                    color="gray"
                    cursor="pointer"
                    onClick={handleToggleFavorite}
                  />
                )}
              </Box>
            </Flex>
            <Flex align="center" mb={6}>
              {reviews.length > 0 ? (
                <StarRating
                  rating={(
                    reviews.reduce((acc, review) => acc + review.rating, 0) /
                    reviews.length
                  ).toFixed(1)}
                  reviewCount={reviews.length}
                />
              ) : (
                <Text fontWeight="bold" color="red.500">
                  NO REVIEWS YET!
                </Text>
              )}
            </Flex>
            {tourDetails.photos &&
              (tourDetails.photos.length > 0 ? (
                <Swiper
                  spaceBetween={15}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  style={{ width: '100%' }}
                >
                  {tourDetails.photos.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={image as string}
                        alt={`Slide ${index}`}
                        width="100%"
                        height="300px"
                        objectFit="cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Flex align="center" gap={5} wrap="wrap">
                  {tourDetails.photos.map((image, index) => (
                    <Box
                      key={index}
                      flex={
                        tourDetails.photos.length === 1
                          ? '0 0 45%'
                          : '0 0 100%'
                      }
                      width="100%"
                      maxWidth="100%"
                      maxHeight="300px"
                      overflow="hidden"
                    >
                      <Image
                        src={image as string}
                        alt={`Photo ${index}`}
                        objectFit="cover"
                        height="300px"
                        width={tourDetails.photos.length === 1 ? '45%' : '100%'}
                      />
                    </Box>
                  ))}
                </Flex>
              ))}
            <Flex mt={4} flexWrap="wrap" justifyContent="space-between">
              <Flex
                direction="column"
                width={{ base: '100%', md: '49%', lg: '58%', '2xl': '69%' }}
                justifySelf="flex-end"
              >
                <Flex align="center">
                  <Icon
                    as={BsGeoAltFill}
                    color="#EC502C"
                    h={18}
                    w={18}
                    mr={2}
                  />
                  <Text color={secondaryColor}>
                    {tourDetails.city}, {tourDetails.country}
                  </Text>
                </Flex>
                <Heading as="h4" size="md" my={4} color={primaryColor}>
                  Description
                </Heading>
                <Text mb={6}>{tourDetails.description}</Text>
                <Divider
                  orientation="horizontal"
                  width="100%"
                  borderColor="#D3D3D3"
                  mb={6}
                />
                <Flex direction="column">
                  <Flex align="center" mb={8}>
                    <Icon
                      as={BsPeople}
                      color={secondaryColor}
                      h={22}
                      w={22}
                      mr={2}
                    />
                    <Text color={secondaryColor}>
                      <b>Max. People: </b>
                      {tourDetails.maxPeople}{' '}
                      {parseInt(tourDetails.maxPeople) === 1
                        ? 'person'
                        : 'people'}
                    </Text>
                  </Flex>
                  <Flex align="center" mb={8}>
                    <Icon
                      as={BsCalendarCheck}
                      mr={2}
                      color={secondaryColor}
                      h={22}
                      w={22}
                    />
                    <Text color={secondaryColor}>
                      <b>Availability Type: </b>
                      {tourDetails.typeOfAvailability === 'recurring'
                        ? 'Recurring'
                        : 'One-time'}
                    </Text>
                  </Flex>
                  <Flex align="center" mb={8}>
                    <Icon
                      as={BsCalendar2Minus}
                      color={secondaryColor}
                      h={22}
                      w={22}
                      mr={2}
                    />
                    <Text color={secondaryColor}>
                      <b>
                        {tourDetails.typeOfAvailability === 'recurring'
                          ? 'Recurring: '
                          : 'Date: '}
                      </b>

                      {tourDetails.typeOfAvailability === 'recurring'
                        ? tourDetails.availability === 'daily'
                          ? 'Daily'
                          : tourDetails.availability === 'weekends'
                            ? 'On weekends'
                            : tourDetails.availability === 'weekdays'
                              ? 'During weekdays'
                              : ''
                        : tourDetails.date}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon
                      as={BsClock}
                      color={secondaryColor}
                      h={22}
                      w={22}
                      mr={2}
                    />
                    <Text color={secondaryColor}>
                      <b>Time: </b>
                      {tourDetails.from} - {tourDetails.to}
                    </Text>
                  </Flex>
                </Flex>
                <Divider
                  orientation="horizontal"
                  width="100%"
                  my={6}
                  borderColor="#D3D3D3"
                />
              </Flex>
              <Flex
                width={{ base: '100%', md: '50%', lg: '40%', '2xl': '30%' }}
              >
                <Box
                  width="100%"
                  border={`1px solid #D3D3D3`}
                  borderRadius="lg"
                  p={4}
                  display="flex"
                  flexDir="column"
                  alignItems="center"
                >
                  <Heading as="h5" size="md" color={primaryColor} mb={4}>
                    Book your spot
                  </Heading>
                  <Divider
                    orientation="horizontal"
                    width="100%"
                    mb={2}
                    borderColor="#D3D3D3"
                  />
                  <Calendar
                    onChange={onChange}
                    value={value}
                    minDate={startOfDay(new Date())}
                    className="myCustomCalendarStyle"
                  />
                  {isBooked && bookingStatus ? (
                    <Box width="100%">
                      {bookingStatus === 'COMPLETED' ? (
                        <>
                          <Text
                            color="green.500"
                            mt={4}
                            fontWeight="bold"
                            textAlign="center"
                          >
                            This tour has been completed. You can book it again!
                          </Text>
                          <Button width="100%" mt={4} onClick={handleBooking}>
                            Book Again
                          </Button>
                        </>
                      ) : (
                        <>
                          <Box
                            color={
                              bookingStatus === 'CONFIRMED'
                                ? 'green.500'
                                : 'red.500'
                            }
                            mt={4}
                            fontWeight="bold"
                            textAlign="center"
                          >
                            You have booked this tour for{' '}
                            {bookingDate
                              ? new Date(bookingDate).toLocaleDateString()
                              : 'an unknown date'}
                            <br />
                            <Text
                              alignItems="center"
                              justifyContent="center"
                              mt={1}
                              display="flex"
                            >
                              Booking Status:{' '}
                              <Badge
                                variant="solid"
                                fontSize={15}
                                ml={1}
                                colorScheme={
                                  bookingStatus === 'CONFIRMED'
                                    ? 'green'
                                    : 'red'
                                }
                              >
                                {bookingStatus}
                              </Badge>
                            </Text>
                          </Box>
                          {bookingStatus !== 'CANCELLED' &&
                          bookingStatus !== 'COMPLETED' ? (
                            <Button
                              width="100%"
                              mt={4}
                              onClick={() =>
                                handleCancelBooking(
                                  currentTourBooking?._id || '',
                                )
                              }
                              colorScheme="red"
                            >
                              Cancel
                            </Button>
                          ) : null}
                        </>
                      )}
                    </Box>
                  ) : (
                    <Button
                      width="100%"
                      mt={4}
                      onClick={handleBooking}
                      isDisabled={isBooked && bookingStatus !== 'COMPLETED'}
                    >
                      {isBooked && !bookingStatus
                        ? 'Booking in progress...'
                        : 'Book'}
                    </Button>
                  )}
                </Box>
              </Flex>
            </Flex>
            <Flex flexDir="column" mt={4}>
              <Heading as="h4" size="md" color={primaryColor} mb={4}>
                Reviews
              </Heading>
              {isBooked && bookingStatus === 'COMPLETED' && (
                <ReviewForm
                  tourId={tourDetails._id as string}
                  onSubmitSuccess={onSubmitReview}
                />
              )}
              {reviews.length > 0 ? (
                <StarRating
                  rating={(
                    reviews.reduce((acc, review) => acc + review.rating, 0) /
                    reviews.length
                  ).toFixed(1)}
                  reviewCount={reviews.length}
                />
              ) : (
                <Text fontWeight="bold" color="red.500">
                  NO REVIEWS YET!
                </Text>
              )}
              {reviews.map((review) => (
                <React.Fragment key={review._id}>
                  <VStack align="start" my={5}>
                    <Flex align="center" mb={4}>
                      <Avatar src={review.user.profilePictureURL} size="lg" />
                      <Flex flexDir="column" ml={4}>
                        <Text fontWeight="bold" mb={1}>
                          {review.user.firstName} {review.user.lastName}
                        </Text>
                        <Text fontSize="sm" mb={1}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                        <StarRating
                          rating={review.rating}
                          showDetails={false}
                        />
                      </Flex>
                    </Flex>
                    <Text>{review.comment}</Text>
                  </VStack>
                  <Divider
                    orientation="horizontal"
                    width="100%"
                    borderColor="#D3D3D3"
                  />
                </React.Fragment>
              ))}
            </Flex>
          </VStack>
        )
      )}
    </PageLayout>
  )
}

export default TourDetails
