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
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../hooks/useAuthContext";

function About() {
  const { state } = useAuthContext();
  const { user } = state;

  return (
    <Flex minHeight="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
      </Flex>
    </Flex>
  );
}

export default About;
