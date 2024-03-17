import React from "react";
import { Flex, VStack, Heading, useTheme } from "@chakra-ui/react";
import { Navbar, Sidebar } from "../components";
import { useAuthContext } from "../hooks";

const About: React.FC = () => {
  const { state } = useAuthContext();
  const { user } = state;
  const theme = useTheme();
  const primaryColor = theme.colors.primary;

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
};

export default About;
