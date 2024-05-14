import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageLayout, TourCard } from '../components'
import { useAuthContext } from '../hooks'
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  Spinner,
  Tag,
  TagLabel,
  Text,
  VStack,
  useTheme,
} from '@chakra-ui/react'
import { getAllUsers, getUserTours } from '../services'
import {
  BsCalendar2Minus,
  BsTranslate,
  BsGenderAmbiguous,
  BsPersonSquare,
  BsEnvelopeAt,
  BsCardText,
  BsTelephone,
  BsBookmarkHeart,
  BsGeo,
  BsCake2,
  BsFillGeoAltFill,
} from 'react-icons/bs'
import { Tour, User } from '../types'
import bgImage from '../assets/user_page-bg.avif'

interface DetailBoxProps {
  icon: React.ElementType
  label: string
  detail: string | string[]
  isList?: boolean
}

const DetailBox: React.FC<DetailBoxProps> = ({
  icon,
  label,
  detail,
  isList = false,
}) => {
  const formatDate = (dateString) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <Flex mb={4} w="full" maxW="md" gap={2}>
      <Icon as={icon} mr={2} w={6} h={6} />
      <Box>
        {isList ? (
          <Flex wrap="wrap" alignItems="center">
            <b>{label}:</b>
            {(detail as string[]).map((item, index) => (
              <Tag
                key={index}
                size="md"
                borderRadius="full"
                variant="solid"
                background="#e0b30d"
                m={1}
              >
                <TagLabel>{item}</TagLabel>
              </Tag>
            ))}
          </Flex>
        ) : (
          <Text>
            <b>{label}:</b>{' '}
            {label === 'Birth Date' ? formatDate(detail) : detail}
          </Text>
        )}
      </Box>
    </Flex>
  )
}

const UserDetails: React.FC = () => {
  const { id } = useParams()
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User>({} as User)
  const [userTours, setUserTours] = useState<Tour[]>([])

  useEffect(() => {
    setIsLoading(true)
    getAllUsers()
      .then((data) => {
        const foundUser = data.find((user) => user._id === id)
        setSelectedUser(foundUser)
        return getUserTours(id)
      })
      .then((tours) => {
        setUserTours(tours)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching users:', error)
        setIsLoading(false)
      })
  }, [id])

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
        <>
          <Box
            position="relative"
            w="full"
            bgImage={`linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImage})`}
            bgSize="cover"
            bgPosition="center"
            color="white"
            py={20}
            px={8}
            mt={{ base: 12, md: 0 }}
            minHeight={{ base: '14rem', md: '15rem', lg: '16rem', xl: '18rem' }}
            width="full"
          >
            <Flex
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              alignItems="center"
              gap={{ base: 4, md: 8 }}
            >
              <Avatar
                src={selectedUser.profilePictureURL}
                width={{ base: '9rem', md: '12rem' }}
                height={{ base: '9rem', md: '12rem' }}
                marginRight={4}
                style={{
                  border: '3px solid white',
                  padding: '5px',
                  outline: '10px solid transparent',
                  boxSizing: 'content-box',
                  boxShadow: '0 0 10px rgba(0,0,0,0.6)',
                }}
              />
              <Box paddingLeft={4}>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  mb={2}
                  textDecoration="underline"
                >
                  {selectedUser.username}
                </Text>
                <Text
                  fontSize="2xl"
                  mb={2}
                  fontWeight={400}
                  textTransform="uppercase"
                >
                  {selectedUser.firstName} {selectedUser.lastName}
                </Text>
                <Badge
                  bgColor="whiteAlpha.300"
                  color="white"
                  p={{ base: 1.5, md: 2 }}
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  fontWeight="medium"
                  mb={2}
                >
                  <Text
                    textTransform="capitalize"
                    ml={2}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={BsFillGeoAltFill} mr={2} /> {selectedUser.country}
                    , {selectedUser.city}
                  </Text>
                </Badge>
                <Text fontSize="sm" fontWeight="semibold">
                  {new Date().getFullYear() -
                    new Date(selectedUser.birthDate).getFullYear() -
                    (new Date().getMonth() <
                      new Date(selectedUser.birthDate).getMonth() ||
                    (new Date().getMonth() ===
                      new Date(selectedUser.birthDate).getMonth() &&
                      new Date().getDate() <
                        new Date(selectedUser.birthDate).getDate())
                      ? 1
                      : 0)}{' '}
                  y.o.
                </Text>
              </Box>
            </Flex>
          </Box>
          <VStack align="stretch" p={8}>
            <Flex wrap="wrap" justify="space-between" color={secondaryColor}>
              <DetailBox
                icon={BsCalendar2Minus}
                label="Full Name"
                detail={`${selectedUser.firstName} ${selectedUser.lastName}`}
              />
              <DetailBox
                icon={BsPersonSquare}
                label="Username"
                detail={selectedUser.username || 'N/A'}
              />
              <DetailBox
                icon={BsEnvelopeAt}
                label="Email"
                detail={selectedUser.email || 'N/A'}
              />
              <DetailBox
                icon={BsCake2}
                label="Birth Date"
                detail={selectedUser.birthDate}
              />
              <DetailBox
                icon={BsGenderAmbiguous}
                label="Gender"
                detail={selectedUser.gender}
              />
              <DetailBox
                icon={BsGeo}
                label="Country"
                detail={selectedUser.country}
              />
              <DetailBox icon={BsGeo} label="City" detail={selectedUser.city} />
              <DetailBox
                icon={BsTelephone}
                label="Phone Number"
                detail={selectedUser.phoneNumber}
              />

              <DetailBox
                icon={BsTranslate}
                label="Languages"
                detail={selectedUser.languagesSpoken || []}
                isList={true}
              />
              <DetailBox
                icon={BsBookmarkHeart}
                label="Interests"
                detail={selectedUser.interests || []}
                isList={true}
              />
            </Flex>
            <Flex mb={4} w="full" maxW="md" gap={2} color={secondaryColor}>
              <Icon as={BsCardText} mr={2} w={6} h={6} />
              <Text>
                <b>Bio:</b> {selectedUser.bio}
              </Text>
            </Flex>
            <Divider
              orientation="horizontal"
              width="100%"
              borderColor="#D3D3D3"
              mb={4}
            />
            <Heading as="h4" size="md" mb={4} color={primaryColor}>
              {selectedUser.firstName}'s Tours
            </Heading>
            <Flex wrap="wrap" gap={4}>
              {userTours.length > 0 ? (
                userTours.map((tour) => <TourCard key={tour._id} tour={tour} />)
              ) : (
                <Text
                  fontWeight="bold"
                  color="red.500"
                  textTransform="uppercase"
                >
                  {selectedUser.firstName} has no tours yet!
                </Text>
              )}
            </Flex>
          </VStack>
        </>
      )}
    </PageLayout>
  )
}

export default UserDetails
