import React from "react";
import {
  Box,
  Flex,
  Image,
  VStack,
  Input,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import AuthBgImage from "../assets/hero-bg5.jpg";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = React.useState(true); // Toggle between signup and login
  const signUpButtonBgColor = useColorModeValue("#0B6B78", "#D1F366");
  const signUpButtonTextColor = useColorModeValue("white", "#141627");
  const placeholderTextColor = useColorModeValue("#0B6B78", "white");

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box position="relative" width="full">
        <Flex direction={{ base: "column", md: "row" }} minHeight="100vh">
          <Box
            width={{ md: "50%" }}
            display={{ base: "none", md: "block" }}
            position="relative"
            _before={{
              content: `""`,
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              backgroundColor: "black",
              opacity: 0.3,
              zIndex: 1,
            }}
          >
            <Image
              src={AuthBgImage}
              alt="Background"
              objectFit="cover"
              objectPosition="left"
              width="100%"
              height="100vh"
            />
          </Box>

          <Flex
            width={{ base: "100%", md: "50%" }}
            align="center"
            justify="center"
          >
            <VStack
              spacing={4}
              width="full"
              maxW="md"
              px={{ base: 4, md: 8 }}
              py={8}
            >
              <Heading size="lg" color={signUpButtonBgColor}>
                {isSignUp ? "Sign Up" : "Login"}
              </Heading>
              <Text color={signUpButtonBgColor}>
                {isSignUp ? "Create your account" : "Welcome back!"}
              </Text>
              <Input
                color={signUpButtonBgColor}
                placeholder="Email"
                type="email"
                focusBorderColor={signUpButtonBgColor}
                sx={{
                  "::placeholder": {
                    color: placeholderTextColor,
                  },
                }}
              />
              <Input
                color={signUpButtonBgColor}
                placeholder="Password"
                type="password"
                focusBorderColor={signUpButtonBgColor}
                sx={{
                  "::placeholder": {
                    color: placeholderTextColor,
                  },
                }}
              />
              {isSignUp && (
                <Input
                  color={signUpButtonBgColor}
                  placeholder="Confirm Password"
                  type="password"
                  focusBorderColor={signUpButtonBgColor}
                  sx={{
                    "::placeholder": {
                      color: placeholderTextColor,
                    },
                  }}
                />
              )}
              <Button
                width="full"
                bg={signUpButtonBgColor}
                color={signUpButtonTextColor}
                _hover={{
                  bg: useColorModeValue("#0B6B78", "#D1F366"), // Change the background color on hover
                }}
              >
                {isSignUp ? "Sign Up" : "Login"}
              </Button>
              <Button variant="ghost" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </Button>
            </VStack>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default AuthPage;
