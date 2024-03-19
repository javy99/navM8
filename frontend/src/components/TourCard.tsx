import { Text, VStack, Icon, Flex, Image, useTheme } from '@chakra-ui/react'
import { BsPersonFill, BsCalendar2, BsGeoAltFill } from 'react-icons/bs'

type Props = {
  width: string | undefined
}

const TourCard: React.FC<Props> = ({ width }) => {
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const secondaryColor = theme.colors.secondary

  const openCardDetails = () => {
    // navigate(`/guides/${guide.id}`);
  }

  return (
    <Flex
      flexDirection="row"
      borderRadius="20px"
      overflow="hidden"
      width={width}
      bg="#F6FBFC"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 4px 4px 0 #69490b',
      }}
      cursor="pointer"
      onClick={openCardDetails}
      boxShadow="0 4px 4px 0 #69490b"
      mb={6}
    >
      <VStack>
        <Image
          src={`https://source.unsplash.com/100x100/?guide,$Tashkent,Uzbekistan`}
          alt=""
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </VStack>
      <Flex flexDirection="column" pl={5} justifyContent="center" p={3}>
        <Text fontWeight="bold" fontSize="xl" mb={3} color={primaryColor}>
          Tour name: Buddapest Gems
        </Text>
        <Flex mb={3}>
          <Icon as={BsCalendar2} color="#EC502C" w={5} h={5} />
          <Text ml={2} color={secondaryColor}>
            16 Jan - 25 Jan, 10:00 - 16:00
          </Text>
        </Flex>
        <Flex mb={3}>
          <Icon as={BsGeoAltFill} color="#EC502C" w={5} h={5} />
          <Text ml={2} color={secondaryColor}>
            Budapest, Hungary
          </Text>
        </Flex>
        <Flex mb={3}>
          <Icon as={BsPersonFill} color="#EC502C" w={5} h={5} />
          <Text ml={2} color={secondaryColor}>
            4 people
          </Text>
        </Flex>
        <Text mb={3}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum,
          consectetur.
        </Text>
      </Flex>
    </Flex>
  )
}

export default TourCard
