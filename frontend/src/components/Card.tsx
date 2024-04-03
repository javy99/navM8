import React, { useState } from 'react'
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
} from '@chakra-ui/react'
import {
  BsFillHeartFill,
  BsStarFill,
  BsTranslate,
  BsGeoAltFill,
  BsBookmarkHeartFill,
} from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { User } from '../types'

type Props = {
  guide: any
  user: User | null
}

const Card: React.FC<Props> = ({ guide, user }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary

  const favoriteIconColor = isFavorited ? '#FF000F' : 'gray.300'

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  const openCardDetails = () => {
    navigate(`/guides/${guide.id}`)
  }

  return (
    <ChakraCard
      borderRadius="xl"
      w="330px"
      bg="#F6FBFC"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 4px 4px 0 #69490b',
      }}
      position="relative"
      overflow="hidden"
      cursor="pointer"
      onClick={openCardDetails}
      boxShadow="0 4px 4px 0 #69490b"
    >
      <CardHeader p={0}>
        <Image
          src={`https://source.unsplash.com/350x250/?guide,${guide.city},${guide.country}`}
          alt={guide.name}
          borderTopLeftRadius="xl"
          borderTopRightRadius="xl"
          width="100%"
          objectFit="cover"
        />
      </CardHeader>

      <CardBody pb={0}>
        <Text fontWeight="bold" fontSize="xl" mb={2} color={primaryColor}>
          {guide.name}
        </Text>
        <Flex align="center" fontSize="sm" mb={2}>
          <Icon as={BsGeoAltFill} mr={2} color="#EC502C" w={3} h={3} />
          <Text color={secondaryColor}>
            {guide.city}, {guide.country}
          </Text>
        </Flex>
        <Text fontSize="sm" color="#0B0006">
          {guide.description}
        </Text>
      </CardBody>

      <CardFooter>
        <VStack align="stretch">
          <Flex align="center" fontSize="sm" mb={2}>
            <Icon as={BsTranslate} mr={3} color="#38A169" w={4} h={4} />
            <Text>
              <b>Spoken Languages:</b> {guide.spokenLanguages.join(', ')}
            </Text>
          </Flex>
          <Flex align="center" fontSize="sm" mb={2}>
            <Icon as={BsFillHeartFill} mr={3} color="#E53E3E" w={4} h={4} />
            <Text>
              <b>Interests:</b> {guide.interests.join(', ')}
            </Text>
          </Flex>
          <Flex align="center" fontSize="sm">
            <Icon as={BsStarFill} mr={3} color="#D69E2E" w={4} h={4} />
            <Text>
              <b>Review:</b> {guide.review}
            </Text>
          </Flex>
        </VStack>
      </CardFooter>
      {user && (
        <Button
          position="absolute"
          bottom="3"
          right="3"
          size="sm"
          onClick={toggleFavorite}
          _hover={{
            bg: 'transparent',
          }}
          bg="transparent"
        >
          <Icon
            as={BsBookmarkHeartFill}
            w={6}
            h={6}
            color={favoriteIconColor}
          />
        </Button>
      )}
    </ChakraCard>
  )
}

export default Card
