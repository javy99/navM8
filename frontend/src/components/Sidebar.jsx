import React from "react";
import {
  Box,
  Flex,
  VStack,
  Divider,
  Icon,
  Text,
  Image,
  List,
  ListItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useBreakpointValue,
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
import { useSidebarContext } from "../context/SidebarContext";

const Sidebar = ({ user }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebarContext();

  const primaryColor = "#0B6B78";
  const whiteColor = "white";

  const commonStyles = {
    bg: primaryColor,
    color: whiteColor,
    p: 6,
    position: "sticky",
    top: 0,
    left: 0,
    h: "100vh",
    overflowY: "auto",
  };

  const links = user
    ? [
        {
          icon: BsFillHouseDoorFill,
          label: "Home",
          to: "/",
        },
        {
          icon: BsFillInfoCircleFill,
          label: "About Us",
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
          label: "About Us",
          to: "/about",
        },
      ];

  // Determine if we're on a small screen (below the 'md' breakpoint)
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  // Function to conditionally toggle the sidebar
  const handleClick = () => {
    if (isSmallScreen) {
      toggleSidebar();
    }
  };

  // Sidebar content component for reuse in both drawer and static sidebar
  const SidebarContent = () => (
    <>
      <VStack align="center" mb={2}>
        <NavLink to="/" onClick={handleClick}>
          <Image src={logo} alt="logo" cursor="pointer" />
        </NavLink>
      </VStack>
      <Divider orientation="horizontal" />
      <List spacing={3} my={7}>
        {links.map((link) => (
          <ListItem key={link.label}>
            <NavLink
              to={link.to}
              style={{ textDecoration: "none" }}
              onClick={handleClick}
            >
              {({ isActive }) => (
                <Flex
                  align="center"
                  py={2}
                  px={4}
                  borderRadius="xl"
                  role="group"
                  cursor="pointer"
                  _hover={{
                    bg: whiteColor,
                    color: primaryColor,
                    fontWeight: "bold",
                    boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                  }}
                  bg={isActive ? whiteColor : "transparent"}
                  color={isActive ? primaryColor : whiteColor}
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  <Icon
                    as={link.icon}
                    mr="4"
                    w={{ base: 4, md: 5 }}
                    h={{ base: 4, md: 5 }}
                  />
                  <Text fontSize={{ base: "sm", md: "md" }}>{link.label}</Text>
                </Flex>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      <Drawer isOpen={isSidebarOpen} placement="left" onClose={toggleSidebar}>
        <DrawerOverlay />
        <DrawerContent
          width={{ base: "75vw", sm: "60vw", md: "45vw", lg: "30vw" }}
        >
          <DrawerCloseButton
            color={primaryColor}
            bgColor={whiteColor}
            zIndex={100}
          />
          <DrawerBody {...commonStyles}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box
        display={{ base: "none", lg: "block" }}
        {...commonStyles}
        minWidth="250px"
        width={{
          md: "250px",
          lg: "270px",
          xl: "280px",
        }}
      >
        <SidebarContent />
      </Box>
    </>
  );
};

export default Sidebar;
