import React from "react";
import {
  Box,
  Flex,
  Image,
  VStack,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../hooks/useAuthContext";
import BookingCard from "../components/BookingCard";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import myBookingsBg from "../assets/mybookings-bg.jpg";

function MyBookings() {
  const { state } = useAuthContext();
  const { user } = state;
  const navigate = useNavigate();
  const primaryColor = "#0B6B78";
  const secondaryColor = "#69490B";
  const whiteColor = "#FFFFFF";

  const bookingCardWidth = useBreakpointValue({ base: "100%", md: "48%" });
  const imageBoxSize = useBreakpointValue({ base: "100%", md: "50%" });
  const contentPadding = useBreakpointValue({ base: "30px", md: "40px", lg: "50px"});
  const flexDirection = useBreakpointValue({ base: "column", md: "row" });

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
            bg={whiteColor}
            borderRadius="20px"
            overflow="hidden"
            mx={12}
            border={`4px solid ${primaryColor}`}
          >
            <Flex justifyContent="space-between" direction={flexDirection}>
              <Flex
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                p={contentPadding}
                w={imageBoxSize}
              >
                <Text
                  fontSize="xl"
                  fontWeight="semibold"
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
              <Box w={imageBoxSize}>
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
            <Flex flexWrap="wrap" justifyContent="space-between" mx={12}>
              <BookingCard width={bookingCardWidth} />
              <BookingCard width={bookingCardWidth} />
              <BookingCard width={bookingCardWidth} />
              <BookingCard width={bookingCardWidth} />
            </Flex>
          </Box>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default MyBookings;
