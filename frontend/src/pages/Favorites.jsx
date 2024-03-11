import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import Card from "../components/Card";

function Favorites() {
  const { state } = useAuthContext();
  const { user } = state;

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
        <VStack align="stretch" p={8}>
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            Favorites
          </Heading>
          <Flex flexWrap="wrap" gap="32px">
            {featuredGuides.map((guide) => (
              <Box key={guide.id}>
                <Card guide={guide} user={user} />
              </Box>
            ))}
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default Favorites;
