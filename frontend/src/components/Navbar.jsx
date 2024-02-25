import React from "react";
import {
  Flex,
  Button,
  Box,
  Text,
  useColorMode,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const Navbar = () => {
  const { logout } = useLogout();
  const { state } = useAuthContext();
  const { user } = state;

  const handleClick = () => {
    logout();
  };

  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const signUpLoginBg = useColorModeValue("#0B6B78", "#D1F366"); // Background color for the button
  const signUpLoginColor = useColorModeValue("white", "#141627"); // Text color for better contrast

  return (
    <Flex
      h="60px"
      alignItems="center"
      justifyContent="flex-end"
      px={4}
      boxShadow="md"
      width="full"
      maxWidth="1920px" // Adjust for a more compact presentation
      mx="auto" // Center the navbar
    >
      {user && (
        <Flex align="center">
          <Text mr={4}>{user.email}</Text>
          <Button
            mr={4}
            bg={signUpLoginBg}
            color={signUpLoginColor}
            _hover={{
              bg: signUpLoginBg,
            }}
            onClick={handleClick}
          >
            Logout
          </Button>
        </Flex>
      )}
      {!user && (
        <Box>
          <Button
            mr={4}
            bg={signUpLoginBg}
            color={signUpLoginColor}
            _hover={{
              bg: signUpLoginBg,
            }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
          <Button
            mr={4}
            bg={signUpLoginBg}
            color={signUpLoginColor}
            _hover={{
              bg: signUpLoginBg,
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      )}

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
