import React from "react";
import {
  Box,
  Flex,
  VStack,
  Divider,
  useColorModeValue,
  Icon,
  Text,
  Image,
  List,
  ListItem,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import {
  BsFillMapFill,
  BsBookmarkHeartFill,
  BsFillPinMapFill,
  BsChatLeftFill,
  BsFillHouseDoorFill,
  BsFillInfoCircleFill,
  BsPersonCircle,
} from "react-icons/bs";

const Sidebar = ({ user }) => {
  const bgColor = useColorModeValue("#0B6B78", "#1C1F37");
  const textColor = useColorModeValue("white", "gray.300");
  const hoverTextColor = useColorModeValue("#0B6B78", "#1C1F37"); // Adjusted for clarity
  const hoverBgColor = useColorModeValue("white", "#D1F366"); // Adjusted for clarity

  const links = user
    ? [
        {
          icon: BsFillHouseDoorFill,
          label: "Home",
          to: "/",
        },
        {
          icon: BsFillInfoCircleFill,
          label: "About & How-To",
          to: "/about",
        },
        {
          icon: BsPersonCircle,
          label: "Profile",
          to: "/profile",
        },
        {
          icon: BsChatLeftFill,
          label: "Messages",
          to: "/messages",
        },
        {
          icon: BsFillMapFill,
          label: "My Bookings",
          to: "/bookings",
        },
        {
          icon: BsBookmarkHeartFill,
          label: "Favorites",
          to: "/favorites",
        },
        {
          icon: BsFillPinMapFill,
          label: "My Tours",
          to: "/mytours",
        },
      ]
    : [
        {
          icon: BsFillHouseDoorFill,
          label: "Home",
          to: "/",
        },
        {
          icon: BsFillInfoCircleFill,
          label: "About & How-To",
          to: "/about",
        },
      ];

  return (
    <Box
      bg={bgColor}
      w={{ base: "full", sm: "60", md: "72" }}
      p={6}
      h="100vh"
      position="sticky"
      top={0}
      left={0}
      // boxShadow="4px 0 6px -1px rgba(0, 0, 0, 0.1), 2px 0 4px -1px rgba(0, 0, 0, 0.3)"
    >
      <VStack align="center" mb={2}>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <Image src={logo} alt="logo" cursor="pointer" />
        </NavLink>
      </VStack>

      <Divider orientation="horizontal" />

      <List spacing={4} my={7}>
        {links.map((link) => (
          <ListItem key={link.label}>
            <NavLink to={link.to} style={{ textDecoration: "none" }}>
              {({ isActive }) => (
                <Flex
                  align="center"
                  py={4}
                  px={6}
                  borderRadius="xl"
                  role="group"
                  cursor="pointer"
                  _hover={{
                    bg: hoverBgColor,
                    color: hoverTextColor,
                    fontWeight: "bold",
                    boxShadow: "0 4px 4px 0 #69490b",
                  }}
                  bg={isActive ? hoverBgColor : "transparent"}
                  color={isActive ? hoverTextColor : textColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  boxShadow={isActive ? "0 4px 4px 0 #69490b" : "none"}
                >
                  <Icon as={link.icon} mr="4" w={5} h={5} />
                  <Text>{link.label}</Text>
                </Flex>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
