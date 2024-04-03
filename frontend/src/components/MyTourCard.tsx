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
} from '@chakra-ui/react'
import { BsPeopleFill, BsGeoAltFill, BsCalendar4 } from 'react-icons/bs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

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
}

const MyTourCard: React.FC<Props> = ({ width, tour }) => {
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary

  const openCardDetails = () => {
    // navigate(`/guides/${guide.id}`);
  }

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
      borderRadius="20px"
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
                  src={photo}
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

          <Text py={3}>{tour.description}</Text>
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
    </Card>
  )
}

export default MyTourCard
