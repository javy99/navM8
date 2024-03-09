import React, { useState, useEffect } from "react";
import { Flex, Text, Box, Divider, useColorModeValue } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import HeaderBgImage from "../assets/hero-bg6.jpg";
import BookingCard from "../components/BookingCard";
import Card from "../components/Card";
import axios from "axios";

const HomePage = ({ user }) => {
  const [featuredGuides, setFeaturedGuides] = useState([]);
  const primaryColor = useColorModeValue("#0B6B78", "#D1F366");
  const secondaryColor = useColorModeValue("#69490B", "#000");

  useEffect(() => {
    axios
      .get("http://localhost:3001/guides")
      .then((response) => {
        setFeaturedGuides(response.data);
      })
      .catch((error) => {
        console.error("Error fetching featured guides:", error);
      });
  }, []);

  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <Box
          bgImage={`linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${HeaderBgImage})`}
          bgSize="cover"
          bgPosition="center"
          color="white"
          py={20}
          px={4}
          textAlign="center"
        >
          <Text fontSize="3xl" fontWeight="bold" mb={4}>
            Welcome to Your Next Adventure!
          </Text>
          <Text fontSize="lg">
            Explore, Discover, and Plan Your Perfect Getaway
          </Text>
          <SearchBar />
        </Box>
        <Flex direction={{ base: "column", md: "row" }} pb={5} height="100%">
          <Box p={8} flex="3" minW={{ md: "74%" }}>
            <Text fontSize="xl" mb={4} color={primaryColor} fontWeight="bold">
              The Most Popular Tours
            </Text>
            <Flex flexWrap="wrap" gap="32px">
              {featuredGuides.map((guide) => (
                <Box key={guide.id}>
                  <Card guide={guide} user={user} />
                </Box>
              ))}
            </Flex>
          </Box>
          {user && (
            <>
              <Box
                display={{ base: "none", md: "block" }}
                minW={{ md: "2%" }}
                borderLeft="2px dashed"
                borderColor={secondaryColor}
                my={8}
              ></Box>
              <Box flex="1" minW={{ md: "24%" }} py={8}>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  mb={4}
                  color={primaryColor}
                >
                  My Bookings
                </Text>
                <BookingCard />
                <BookingCard />
                <BookingCard />
                <BookingCard />
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HomePage;
