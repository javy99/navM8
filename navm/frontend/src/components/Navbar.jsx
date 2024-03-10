import React from "react";
import {
  Flex,
  Text,
  useColorMode,
  IconButton,
  useColorModeValue,
  HStack,
  Icon,
  Image,
} from "@chakra-ui/react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Button from "./Button";
import { BsPersonCircle } from "react-icons/bs";
import { useUserProfilePhoto } from "../hooks/useUserProfilePhoto";

const Navbar = () => {
  const { logout } = useLogout();
  const { state } = useAuthContext();
  const { user } = state;

  // Use the hook to get the current profile photo
  const { photo: userPhoto } = useUserProfilePhoto();

  const handleClick = () => logout();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const signUpLoginBg = useColorModeValue("#0B6B78", "#D1F366");

  return (
    <Flex
      as="nav"
      height="70px"
      alignItems="center"
      justifyContent="flex-end"
      px={4}
      boxShadow="md"
      gap={4}
    >
      <HStack spacing={4}>
        {user && (
          <>
            {userPhoto ? (
              <Image
                borderRadius="full"
                boxSize="2.5rem"
                src={userPhoto}
                alt="Profile photo"
              />
            ) : (
              <Icon
                as={BsPersonCircle}
                boxSize="2.5rem"
                color="rgba(0, 0, 0, 0.3)"
              />
            )}
            <Text color={signUpLoginBg} fontWeight={600}>
              {user.email}
            </Text>
            <Button onClick={handleClick}>Logout</Button>
          </>
        )}
        {!user && (
          <>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            <Button onClick={() => navigate("/login")}>Login</Button>
          </>
        )}

        <IconButton
          icon={
            colorMode === "light" ? (
              <BsMoonFill color="#0B6B78" />
            ) : (
              <BsSunFill />
            )
          }
          onClick={toggleColorMode}
          aria-label="Toggle dark mode"
          mr={4}
        />
        {/* Placeholder for the calendar component integration */}
      </HStack>
    </Flex>
  );
};

export default Navbar;
