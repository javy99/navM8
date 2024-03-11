import React, { useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  VStack,
  useToast,
  IconButton,
  Checkbox,
  Heading,
  useColorModeValue,
  Text,
  Divider,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../hooks/useAuthContext";
import BookingCard from "../components/BookingCard";
import Button from "../components/Button";
import myBookingsBg from "../assets/mybookings-bg.jpg";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const { state } = useAuthContext();
  const { user } = state;
  const navigate = useNavigate();
  const primaryColor = useColorModeValue("#0B6B78", "#D1F366");
  const secondaryColor = useColorModeValue("#69490B", "#000");

  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <VStack align="stretch" p={8}>
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            My Bookings
          </Heading>
          <Box
            bg="white"
            borderRadius="20px"
            overflow="hidden"
            mx={12}
            border={`4px solid ${primaryColor}`}
          >
            <Flex justifyContent="space-between">
              <Flex
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                p="70px"
                w="50%"
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={secondaryColor}
                  mb={5}
                >
                  No trips booked...yet!
                </Text>
                <Text mb={5} color="#D1D0D0">
                  Time to dust off your bags and start planning your next
                  adventure
                </Text>
                <Button onClick={() => navigate("/")}>Start searching</Button>
              </Flex>
              <Box w="50%">
                <Image
                  src={myBookingsBg}
                  alt="No bookings image"
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              </Box>
            </Flex>
          </Box>
          <Box width="100%" borderTop={`2px dashed ${secondaryColor}`} my={6} />
          <Box>
            <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
              Past Trips
            </Heading>
            <Flex flexWrap="wrap" gap="4%" mx={12}>
              <BookingCard width="48%" />
              <BookingCard width="48%" />
              <BookingCard width="48%" />
              <BookingCard width="48%" />
            </Flex>
          </Box>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default MyBookings;
