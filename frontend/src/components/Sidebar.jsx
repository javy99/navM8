import React from "react";
import {
  Box,
  Flex,
  VStack,
  Button,
  Divider,
  useColorModeValue,
  Icon,
  Text,
} from "@chakra-ui/react";
import {
  FaUserCircle,
  FaEnvelope,
  FaInfoCircle,
  FaSearch,
  FaSignInAlt,
  FaChartBar,
  FaComments,
  FaBookOpen,
} from "react-icons/fa";

const Sidebar = ({ user }) => {
  const bgColor = useColorModeValue("#0B6B78", "#1C1F37");
  const textColor = useColorModeValue("white", "gray.300");
  const hoverTextColor = useColorModeValue("#0B6B78", "#1C1F37"); // Adjusted for clarity
  const hoverBgColor = useColorModeValue("white", "#D1F366"); // Adjusted for clarity
  const iconHoverColor = useColorModeValue(hoverTextColor, "#1C1F37"); // New addition for icon color

  const links = user
    ? [
        {
          icon: FaChartBar,
          label: "Dashboard",
          action: () => console.log("Navigate to Dashboard"),
        },
        {
          icon: FaUserCircle,
          label: "Profile",
          action: () => console.log("Navigate to Profile"),
        },
        {
          icon: FaComments,
          label: "Messages",
          action: () => console.log("Navigate to Messages"),
        },
        {
          icon: FaBookOpen,
          label: "My Bookings",
          action: () => console.log("Navigate to My Bookings"),
        },
      ]
    : [
        {
          icon: FaSearch,
          label: "Explore Guides",
          action: () => console.log("Explore Guides"),
        },
        {
          icon: FaInfoCircle,
          label: "How It Works",
          action: () => console.log("How It Works"),
        },
        {
          icon: FaSignInAlt,
          label: "Sign Up / Login",
          action: () => console.log("Sign Up/Login"),
        },
        {
          icon: FaUserCircle,
          label: "About Us",
          action: () => console.log("About Us"),
        },
        {
          icon: FaEnvelope,
          label: "Contact Us",
          action: () => console.log("Contact Us"),
        },
      ];

  const logoutLink = user
    ? [
        {
          icon: FaSignInAlt,
          label: "Log Out",
          action: () => console.log("Log Out"),
        },
      ]
    : [];

  return (
    <Box
      bg={bgColor}
      w={{ base: "full", sm: "52", md: "56" }}
      p={4}
      h="100vh"
      position="sticky"
      top={0}
      left={0}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      boxShadow="4px 0 6px -1px rgba(0, 0, 0, 0.1), 2px 0 4px -1px rgba(0, 0, 0, 0.3)"
    >
      <Flex direction="column">
        <Flex direction="column" align="center">
          <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
            navM8
          </Text>
        </Flex>

        <Divider orientation="horizontal" />

        <VStack spacing={4} align="stretch" my={5}>
          {links.map((link) => (
            <Button
              key={link.label}
              leftIcon={<Icon as={link.icon} color={textColor} />}
              variant="ghost"
              justifyContent="flex-start"
              onClick={link.action}
              fontWeight={300} 
              color={textColor}
              _hover={{
                color: hoverTextColor,
                bg: hoverBgColor,
                ".chakra-icon": {
                  color: iconHoverColor,
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </VStack>
      </Flex>

      {user && (
        <VStack spacing={4} align="stretch">
          {logoutLink.map((link) => (
            <Button
              key={link.label}
              leftIcon={<Icon as={link.icon} color={textColor} />}
              variant="ghost"
              justifyContent="flex-start"
              onClick={link.action}
              fontWeight={300} 
              color={textColor}
              _hover={{
                color: hoverTextColor,
                bg: hoverBgColor,
                ".chakra-icon": {
                  color: iconHoverColor,
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Sidebar;
