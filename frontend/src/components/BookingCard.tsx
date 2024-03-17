import React from "react";
import {
  Text,
  Flex,
  Image,
  Icon,
  Card as ChakraCard,
  VStack,
  useTheme,
} from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";
import { BsCalendar2 } from "react-icons/bs";

type Props = {
  width: string | undefined;
};

const BookingCard: React.FC<Props> = ({ width }) => {
  // const navigate = useNavigate();
  const theme = useTheme();
  const primaryColor = theme.colors.primary;
  const secondaryColor = theme.colors.secondary;

  const openCardDetails = () => {
    // navigate(`/guides/${guide.id}`);
  };

  return (
    <ChakraCard
      direction="row"
      borderRadius="xl"
      width={width}
      bg="#F6FBFC"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "0 4px 4px 0 #69490b",
      }}
      cursor="pointer"
      onClick={openCardDetails}
      boxShadow="0 4px 4px 0 #69490b"
      p={3}
      mb={6}
    >
      <VStack>
        <Image
          src={`https://source.unsplash.com/100x100/?guide,$Tashkent,Uzbekistan`}
          alt=""
          width="100%"
          objectFit="cover"
          borderRadius="xl"
        />
      </VStack>
      <Flex flexDirection="column" pl={5} justifyContent="center">
        <Text fontWeight="bold" fontSize="xl" mb={3} color={primaryColor}>
          {/* {guide.name} */}Skardu
        </Text>
        <Flex>
          <Icon as={BsCalendar2} color="#EC502C" w={5} h={5} />
          <Text ml={2} color={secondaryColor}>
            16 Jan - 25 Jan
          </Text>
        </Flex>
      </Flex>
    </ChakraCard>
  );
};

export default BookingCard;
