import React, { useState } from "react";
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
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../hooks/useAuthContext";

function About() {
  const { state } = useAuthContext();
  const { user } = state;

  const primaryColor = "#0B6B78";
  const secondaryColor = "#69490B";

  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
        <VStack align="stretch" p={8}>
          <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
            About & How-to
          </Heading>
        </VStack>
      </Flex>
    </Flex>
  );
}

export default About;
