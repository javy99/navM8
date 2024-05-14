import {
  Text,
  Box,
  Stack,
  Image,
  useTheme,
  Card,
  CardBody,
  Heading,
  Flex,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'
import { BsPeopleFill, BsGeoAltFill, BsCalendar4 } from 'react-icons/bs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useEffect, useState } from 'react'
import { Booking } from '../types'
import { useAuthContext } from '../hooks'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import { cancelBooking, fetchBookingsForTour } from '../services'

type ResponsiveWidth = {
  base?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
  [key: string]: string | undefined
}

type Props = {
  width: string | ResponsiveWidth | undefined
  tour?: any
  onApproveBooking?: (bookingId: string) => void
  onEdit?: () => void
  onDelete?: () => void
}

const MyTourCard: React.FC<Props> = ({
  width,
  tour,
  onApproveBooking,
  onEdit,
  onDelete,
}) => {
  const { state } = useAuthContext()
  const { user } = state

  const navigate = useNavigate()

  const toast = useToast()

  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary

  const [bookings, setBookings] = useState<Booking[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const openCardDetails = () => {
    navigate(`/tours/${tour._id}`)
  }

  useEffect(() => {
    const getBookingsForTour = async () => {
      if (tour._id) {
        try {
          const bookingsData = await fetchBookingsForTour(tour._id)
          const sortedBookings = bookingsData.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })

          setBookings(sortedBookings)
        } catch (error) {
          console.error('Error:', error)
        }
      }
    }

    if (tour._id) getBookingsForTour()
  }, [tour._id, user?.token, bookings])

  const handleApproveBooking = async (bookingId: string) => {
    if (onApproveBooking) await onApproveBooking(bookingId)
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId)

      setBookings((prevBookings) =>
        prevBookings.map((booking) => {
          return booking._id === bookingId
            ? { ...booking, status: 'CANCELLED' }
            : booking
        }),
      )

      toast({
        title: 'Booking canceled',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error canceling booking',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    if (onEdit) onEdit()
  }

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (onDelete) onDelete()
    setIsDeleteModalOpen(false)
  }

  const handleViewProfile = (userId) => {
    navigate(`/users/${userId}`)
  }

  return (
    <Box width="100%">
      <Card
        position="relative"
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
        borderRadius="10px"
        width={width}
        bg="#F6FBFC"
        boxShadow="0 4px 4px 0 #69490b"
        cursor="pointer"
        onClick={openCardDetails}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: '0 4px 4px 0 #69490b',
        }}
      >
        {tour.photos.length > 0 && (
          <Box
            maxW={{ base: '100%', sm: '200px', md: '300px' }}
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
                    src={photo}
                    alt={`tour-${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
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

            <Text py={3} maxH="80px" overflowY="auto">
              {tour.description}
            </Text>
            <Flex alignItems="center">
              <Icon as={BsCalendar4} color="#EC502C" w={5} h={5} />
              <Text ml={2} color={secondaryColor}>
                {tour.typeOfAvailability === 'recurring' ? (
                  <>
                    {tour.availability === 'daily' ? 'Daily' : ''}
                    {tour.availability === 'weekends' ? 'Weekends' : ''}
                    {tour.availability === 'weekdays' ? 'Weekdays' : ''}
                  </>
                ) : (
                  new Date(tour.date).toLocaleDateString()
                )}
                , {tour.from} - {tour.to}
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
        </Stack>
        <Flex
          position="absolute"
          bottom={4}
          right={4}
          alignItems="flex-end"
          gap={2}
        >
          <Button size="sm" onClick={handleEditClick}>
            Edit
          </Button>
          <Button size="sm" onClick={handleDeleteClick}>
            Delete
          </Button>
        </Flex>
      </Card>
      {bookings.length > 0 && (
        <Box
          p={4}
          maxH="200px"
          overflowY="auto"
          overflowX="hidden"
          width={{ base: '100%' }}
        >
          <Heading size="sm" mb={4} color={primaryColor}>
            Bookings:
          </Heading>
          {bookings.map((booking) => (
            <Flex
              key={booking._id}
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              p={4}
              bg="gray.100"
              borderRadius="xl"
            >
              <Box>
                <Text fontSize="sm">
                  <b>Name:</b> {booking.userId.firstName}{' '}
                  {booking.userId.lastName}
                </Text>{' '}
                <Text fontSize="sm">
                  <b>Date:</b> {new Date(booking.date).toLocaleDateString()}
                </Text>
                <Text fontSize="sm">
                  <b>Status:</b> {booking.status}
                </Text>
              </Box>
              {booking.status === 'PENDING' && (
                <Flex gap={2}>
                  <Button
                    size="sm"
                    onClick={() => handleApproveBooking(booking._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    background="red.500"
                    _hover={{ background: 'red.600' }}
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel
                  </Button>
                </Flex>
              )}
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => handleViewProfile(booking.userId._id)}
              >
                View Profile
              </Button>
            </Flex>
          ))}
        </Box>
      )}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        isCentered={true}
      >
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
            Confirm Tour Deletion
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <Text>Are you sure you want to delete this tour?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default MyTourCard
