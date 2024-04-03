import React, { useState, useEffect } from 'react'
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
import { useAuthContext } from '../hooks'
import PageLayout from './PageLayout'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Tour } from '../types'
import {
  BsCalendar2Minus,
  BsCalendarCheck,
  BsClock,
  BsGeoAltFill,
  BsPeople,
  BsHeart,
  BsHeartFill,
} from 'react-icons/bs'
import { Button, Rating } from '../components'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { checkIsFavorite, toggleFavorite, getTourById } from '../services'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const TourDetails: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state

  const toast = useToast()

  const [value, onChange] = useState<Value>(new Date())

  const [isFavorite, setIsFavorite] = useState(false)
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const whiteColor = theme.colors.white
  const [tourDetails, setTourDetails] = useState<Tour | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { id } = useParams()

  useEffect(() => {
    const loadTourDetails = async () => {
      setIsLoading(true)
      try {
        if (user && user.token && id) {
          const data = await getTourById(id, user.token)
          setTourDetails(data)
        } else {
          console.error('User token or ID not available')
        }
      } catch (error) {
        console.error('Error fetching tour details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user && user.token && id) {
      loadTourDetails()
    }
  }, [id, user])

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && id && user._id && user.token) {
        const isFav = await checkIsFavorite(user._id, id, user.token)
        setIsFavorite(isFav)
      }
    }

    checkFavoriteStatus()
  }, [user, id])

  const handleToggleFavorite = async () => {
    if (!user || !user._id || !user.token || !id) return

    try {
      await toggleFavorite(user._id, id, isFavorite, false, user.token)
      setIsFavorite(!isFavorite)

      const actionTaken = isFavorite
        ? 'Removed from favorites'
        : 'Added to favorites'
      const status = isFavorite ? 'info' : 'success'

      toast({
        title: actionTaken,
        status: status,
        duration: 2000,
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

  const getSlidesPerView = () => {
    const photosCount = tourDetails?.photos?.length || 0
    return photosCount >= 3 ? 3 : photosCount
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
      ) : tourDetails ? (
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
            <Rating rating={4.5} reviewCount={22} recommendationRate={95} />
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
            >
              <Flex align="center">
                <Icon as={BsGeoAltFill} color="#EC502C" h={18} w={18} mr={2} />
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
                mt={6}
                borderColor="#D3D3D3"
              />
            </Flex>
            <Flex width={{ base: '100%', md: '50%', lg: '40%', '2xl': '30%' }}>
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
                  mb={4}
                  borderColor="#D3D3D3"
                />
                <Calendar
                  onChange={onChange}
                  value={value}
                  className="myCustomCalendarStyle"
                />
                <Button width="100%" mt={4}>
                  Book
                </Button>
              </Box>
            </Flex>
          </Flex>
        </VStack>
      ) : (
        <Text>No tour details available.</Text>
      )}
    </PageLayout>
  )
}

export default TourDetails
