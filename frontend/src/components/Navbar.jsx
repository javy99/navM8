import React from "react";
import {
  Box,
  Flex,
  Button,
  useColorMode,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const signUpLoginBg = useColorModeValue("#0B6B78", "#D1F366"); // Background color for the button
  const signUpLoginColor = useColorModeValue("white", "#141627"); // Text color for better contrast
  const becomeGuideTextColor = useColorModeValue("#0B6B78", "white"); // Dynamic text color for "Become a Guide"

  return (
    <Flex
      h="60px"
      alignItems="center"
      justifyContent="flex-end"
      px={4}
      boxShadow="md"
      width="full"
      maxWidth="1200px" // Adjust for a more compact presentation
      mx="auto" // Center the navbar
    >
      <Button
        mr={4}
        color={becomeGuideTextColor}
        onClick={() => alert("Become a Guide")}
      >
        Become a Guide
      </Button>
      <Button
        mr={4}
        bg={signUpLoginBg}
        color={signUpLoginColor}
        _hover={{
          bg: useColorModeValue("#0B6B78", "#D1F366"),
        }}
        onClick={() => navigate("/auth")}
      >
        Sign Up/Login
      </Button>
      <IconButton
        icon={colorMode === "light" ? <FaMoon color="#0B6B78" /> : <FaSun />}
        onClick={toggleColorMode}
        aria-label="Toggle dark mode"
        mr={4} // Add margin to the right for spacing before the calendar component
      />
      {/* Placeholder for the calendar component integration */}
    </Flex>
  );
};

export default Navbar;
