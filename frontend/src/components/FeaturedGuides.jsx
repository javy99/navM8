import React, { useState, useEffect } from "react";
import { Box, Text, Flex, Wrap, WrapItem, Image, Icon } from "@chakra-ui/react";
import { FaLanguage, FaMapMarkerAlt, FaHeart, FaStar } from "react-icons/fa";
import axios from "axios";

const FeaturedGuides = () => {
  const [featuredGuides, setFeaturedGuides] = useState([]); // State to store featured guides data

  useEffect(() => {
    axios
      .get("http://localhost:3001/guides")
      .then((response) => {
        setFeaturedGuides(response.data);
      })
      .catch((error) => {
        console.error("Error fetching featured guides:", error);
      });
  }, []); // Fetch data only once when the component mounts

  return (
    <Box mt={10} px={4}>
      <Text fontSize="xl" mb={4}>
        Popular Guides
      </Text>
      <Wrap spacing={4}>
        {/* Map through the featured guides array and render each guide */}
        {featuredGuides.map((guide) => (
          <WrapItem key={guide.id}>
            <Box
              p={5}
              shadow="lg"
              borderWidth="1px"
              borderRadius="md"
              w="300px"
              bg="white"
              transition="all 0.3s"
              _hover={{
                transform: "translateY(-5px)",
                shadow: "xl",
              }}
            >
              <Image
                src={`https://source.unsplash.com/300x200/?guide,${guide.city},${guide.country}`}
                alt={guide.name}
                borderRadius="md"
                mb={4}
              />
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                {guide.name}
              </Text>
              <Flex align="center" fontSize="sm" mb={2}>
                <Icon as={FaMapMarkerAlt} mr={2} color="blue.500" />
                <Text color="gray.500">
                  {guide.city}, {guide.country}
                </Text>
              </Flex>
              <Text fontSize="sm" mb={4}>
                {guide.description}
              </Text>
              <Flex align="center" fontSize="sm" mb={2}>
                <Icon as={FaLanguage} mr={2} color="green.500" />
                <Text>
                  <b>Spoken Languages:</b> {guide.spokenLanguages.join(", ")}
                </Text>
              </Flex>
              <Flex align="center" fontSize="sm" mb={2}>
                <Icon as={FaHeart} mr={2} color="red.500" />
                <Text>
                  <b>Interests:</b> {guide.interests.join(", ")}
                </Text>
              </Flex>
              <Flex align="center" fontSize="sm">
                <Icon as={FaStar} mr={2} color="yellow.500" />
                <Text>
                  <b>Review:</b> {guide.review}
                </Text>
              </Flex>
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default FeaturedGuides;
