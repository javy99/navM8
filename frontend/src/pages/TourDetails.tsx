import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
} from '@chakra-ui/react'
import {
  BsCalendar2Minus,
  BsCalendarCheck,
  BsClock,
  BsGeoAltFill,
  BsPeople,
  BsHeart,
  BsHeartFill,
  BsTranslate,
} from 'react-icons/bs'
import axios from 'axios'
import { format, startOfDay } from 'date-fns'
import {
  getTourById,
  fetchBookings,
  createBooking,
  cancelBooking,
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
  const { id } = useParams()
  const whiteColor = theme.colors.white
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary

  const { isFavorite, handleToggleFavorite } = useFavorite(id, user)

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
        if (user && user.token && id && user._id) {
          const tourData = await getTourById(id)
          setTourDetails(tourData)

          // Fetch bookings
          const bookings = await fetchBookings(user.token)
          const tourBooking = bookings.find(
            (booking) => booking.tour._id === id,
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
        // Handle error
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, user, bookingStatus])

  useEffect(() => {
    const fetchReviews = async () => {
      if (
        user &&
        user.token &&
        id &&
        tourDetails &&
        typeof tourDetails.reviewCount === 'number' &&
        tourDetails.reviewCount > 0
      ) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/reviews/${id}`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            },
          )
          setReviews(response.data)
        } catch (error) {
          console.error('Error fetching reviews:', error)
        }
      }
    }

    fetchReviews()
  }, [id, user?.token, tourDetails])

  // Get number of slides per view based on number of photos
  const getSlidesPerView = () => {
    const photosCount = tourDetails?.photos?.length || 0
    return photosCount >= 3 ? 3 : photosCount
  }

  // Book tour
  const handleBooking = async () => {
    if (!user || !user.token || !id || !value) {
      toast({
        title: 'Please log in and select a date to book this tour.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
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

    try {
      const booking = await createBooking(id, bookingDateISO, user.token)

      setIsBooked(true)
      setBookingStatus('PENDING')
      setCurrentTourBooking(booking)

      toast({
        title: 'Booking successful!',
        description: 'Your tour has been booked.',
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

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!user || !user.token || !id || !currentTourBooking) {
      toast({
        title: 'Please log in to cancel this booking.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      await cancelBooking(bookingId, user.token)

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
                <Text fontStyle="italic">
                  By{' '}
                  <b>
                    {tourDetails.author.firstName} {tourDetails.author.lastName}
                  </b>
                </Text>
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
              tourDetails.photos.length > 0 &&
              (tourDetails.photos.length > 3 ? (
                <Swiper
                  spaceBetween={15}
                  slidesPerView={getSlidesPerView()}
                  navigation
                  pagination={{ clickable: true }}
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
                      flex={tourDetails.photos.length === 1 ? '0 1 auto' : '1'}
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
                      <Text
                        color="red.500"
                        mt={4}
                        fontWeight="bold"
                        textAlign="center"
                      >
                        {bookingStatus === 'COMPLETED' ? (
                          <>
                            This tour has been completed. You can book it again!
                          </>
                        ) : (
                          <>
                            You have booked this tour for{' '}
                            {bookingDate
                              ? new Date(bookingDate).toLocaleDateString()
                              : 'an unknown date'}
                            . Booking Status: {bookingStatus}.
                          </>
                        )}
                      </Text>
                      {bookingStatus !== 'CANCELLED' ? (
                        <Button
                          width="100%"
                          mt={4}
                          onClick={() =>
                            handleCancelBooking(currentTourBooking?._id || '')
                          }
                          colorScheme="red"
                        >
                          Cancel
                        </Button>
                      ) : null}
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
            <Flex direction="column">
              <Heading as="h4" size="md" color={primaryColor} mb={8} mt={4}>
                Tour Author
              </Heading>
              <Flex align="center" mb={8}>
                <Icon
                  as={BsCalendar2Minus}
                  color={secondaryColor}
                  h={22}
                  w={22}
                  mr={2}
                />
                <Text color={secondaryColor}>
                  <b>Full Name: </b>
                  {tourDetails.author.firstName} {tourDetails.author.lastName}
                </Text>
              </Flex>
              <Flex align="center" mb={8}>
                <Icon
                  as={BsTranslate}
                  color={secondaryColor}
                  h={22}
                  w={22}
                  mr={2}
                />
                <Text color={secondaryColor}>
                  <b>Languages Spoken: </b>
                  {tourDetails.author.languagesSpoken.join(', ')}
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
                  <b>Interests: </b>
                  {tourDetails.author.interests.join(', ')}
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
                  <b>Bio: </b>
                  {tourDetails.author.bio}
                </Text>
              </Flex>
              <Flex align="center" mb={8}>
                <Icon
                  as={BsClock}
                  color={secondaryColor}
                  h={22}
                  w={22}
                  mr={2}
                />
                <Text color={secondaryColor}>
                  <b>Age: </b>
                  {new Date().getFullYear() -
                    new Date(tourDetails.author.birthDate).getFullYear() -
                    (new Date().getMonth() <
                      new Date(tourDetails.author.birthDate).getMonth() ||
                    (new Date().getMonth() ===
                      new Date(tourDetails.author.birthDate).getMonth() &&
                      new Date().getDate() <
                        new Date(tourDetails.author.birthDate).getDate())
                      ? 1
                      : 0)}{' '}
                  y.o.
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
                  <b>Place of birth: </b>
                  {tourDetails.author.country}, {tourDetails.author.city}
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
                  <b>Gender: </b>
                  {tourDetails.author.gender}
                </Text>
              </Flex>
            </Flex>
            <Divider
              orientation="horizontal"
              width="100%"
              borderColor="#D3D3D3"
            />
            <Flex flexDir="column" mt={8}>
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
