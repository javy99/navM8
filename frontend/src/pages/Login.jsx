import React, { useState } from "react";
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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import AuthBgImage from "../assets/hero-bg5.jpg";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isLoading, login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error.response.data);
    }
  };

  const bgColor = useColorModeValue("#0B6B78", "#D1F366");
  const textColor = useColorModeValue("white", "#141627");
  const placeholderColor = useColorModeValue("#0B6B78", "white");
  // Added a light background color for the form container
  const formBgColor = useColorModeValue(
    "linear(to-b, gray.100, gray.200)",
    "linear(to-b, gray.700, gray.800)"
  );

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
              as="form"
              onSubmit={handleSubmit}
              spacing={4}
              width="full"
              maxW="md"
              px={{ base: 4, md: 8 }}
              py={8}
              bg={formBgColor}
              boxShadow="xl"
              p={8} // Increased padding around the form container
              m={4} // Added margin for separation
              bgGradient={formBgColor} // Applied gradient background
              borderRadius="lg" // Rounded corners
            >
              <Heading size="lg" color={bgColor}>
                Login
              </Heading>
              <Text color={bgColor}>Welcome back!</Text>
              <Input
                name="email"
                color={bgColor}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                focusBorderColor={bgColor}
                sx={{
                  "::placeholder": {
                    color: placeholderColor,
                  },
                }}
              />
              <InputGroup>
                <Input
                  name="password"
                  color={bgColor}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  focusBorderColor={bgColor}
                  sx={{
                    "::placeholder": {
                      color: placeholderColor,
                    },
                  }}
                  autoComplete="current-password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? (
                      <ViewOffIcon color={bgColor} />
                    ) : (
                      <ViewIcon color={bgColor} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <Button
                disabled={isLoading}
                type="submit"
                width="full"
                bg={bgColor}
                color={textColor}
                _hover={{
                  bg: bgColor,
                }}
              >
                Login
              </Button>
              {error && (
                <Text color="red.500" textAlign="center">
                  {error}
                </Text>
              )}
            </VStack>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Login;
