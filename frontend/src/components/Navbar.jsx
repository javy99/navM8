import React from "react";
import {
  Flex,
  Text,
  HStack,
  Icon,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Button from "./Button";

import { useProfilePhoto } from "../context/ProfilePhotoContext";
import { useSidebarContext } from "../context/SidebarContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { state } = useAuthContext();
  const { user } = state;
  const { toggleSidebar } = useSidebarContext();
  const { photo } = useProfilePhoto();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  const primaryColor = "#0B6B78";
  const whiteColor = "white";
  const navPadding = useBreakpointValue({ base: 2, md: 4 });
  const iconSize = useBreakpointValue({ base: "2rem", md: "2.5rem" });
  // Declare variables for responsive display without conditionals
  const isMobile = useBreakpointValue({ base: true, sm: false });

  return (
    <Flex
      as="nav"
      height="70px"
      alignItems="center"
      px={navPadding}
      boxShadow="md"
      bg={whiteColor}
      position={{ base: "fixed", md: "static" }}
      top={0}
      left={0}
      right={0}
      w="full"
      zIndex={100}
    >
      <IconButton
        display={{ base: "flex", lg: "none" }}
        icon={<HamburgerIcon color={whiteColor} boxSize="25px" />}
        onClick={toggleSidebar}
        aria-label="Open menu"
        size="md"
        mr={2}
        bg={primaryColor}
        _hover={{ bg: primaryColor }}
      />
      <HStack spacing={4} justifyContent="flex-end" flex={1}>
        {user && (
          <>
            {photo ? (
              <Image
                borderRadius="full"
                boxSize={iconSize}
                src={photo}
                alt="Profile photo"
              />
            ) : (
              <Icon
                as={BsPersonCircle}
                boxSize={iconSize}
                color="rgba(0, 0, 0, 0.3)"
              />
            )}
            {!isMobile && (
              <Text color={primaryColor} fontWeight={600}>
                {user.email}
              </Text>
            )}
            <Button onClick={handleLogoutClick}>Logout</Button>
          </>
        )}
        {!user && (
          <>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            <Button onClick={() => navigate("/login")}>Login</Button>
          </>
        )}
      </HStack>
    </Flex>
  );
};

export default Navbar;
