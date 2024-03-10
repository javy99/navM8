import React, { useState } from "react";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BsCalendar2 } from "react-icons/bs";

const BookingCard = () => {
  const navigate = useNavigate();
  const primaryColor = useColorModeValue("#0B6B78", "#D1F366");
  const secondaryColor = useColorModeValue("#69490B", "#000");

  const openCardDetails = () => {
    // navigate(`/guides/${guide.id}`);
  };

  return (
    <ChakraCard
      direction="row"
      borderRadius="xl"
      w="330px"
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
      <Flex flexDirection="column" pl={5} justifyContent='center'>
        <Text fontWeight="bold" fontSize="xl" mb={3} color={primaryColor}>
          {/* {guide.name} */}Skardu
        </Text>
        <Flex>
          <Icon as={BsCalendar2} color="#EC502C" w={5} h={5}/>
          <Text ml={2} color={secondaryColor}>
            16 Jan - 25 Jan
          </Text>
        </Flex>
      </Flex>
    </ChakraCard>
  );
};

export default BookingCard;
