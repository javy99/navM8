import React from "react";
import { Flex, Text, Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import FeaturedGuides from "../components/FeaturedGuides";
import Sidebar from "../components/Sidebar";
import HeaderBgImage from "../assets/hero-bg6.jpg";

const HomePage = ({ user }) => {
  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <Box
          // bgImage={`url(${HeaderBgImage})`}
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
        <Flex
          minHeight="100vh"
          direction={{ base: "column", md: "row" }}
          pb={5}
        >
          <Flex direction="column" flex="1" overflowY="auto">
            <FeaturedGuides />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HomePage;
