import React, { useState } from "react";
import {
  Box,
  Flex,
  Image,
  VStack,
  Input,
  Button as ChakraButton,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  useTheme,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import AuthBgImage from "../assets/hero-bg5.jpg";
import { useSignup } from "../hooks";
import { Button } from "../components";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isLoading, signup } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const primaryColor = theme.colors.primary;

  const navigate = useNavigate();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const success = await signup(email, password, username);
      if (success) {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Signup failed", error.response.data);
    }
  };

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
            <form
              onSubmit={handleSubmit}
              style={{
                width: "85%",
                maxWidth: "md",
                padding: "32px",
                borderRadius: "lg",
              }}
            >
              <VStack
                spacing={4}
                width="full"
                px={{ base: 4, md: 8 }}
                boxShadow="xl"
                py={8}
              >
                <Heading size="lg" color={primaryColor}>
                  Sign Up
                </Heading>
                <Text color={primaryColor}>Create your account</Text>
                <Input
                  name="username"
                  color={primaryColor}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  focusBorderColor={primaryColor}
                  sx={{ "::placeholder": { color: primaryColor } }}
                />
                <Input
                  name="email"
                  color={primaryColor}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  focusBorderColor={primaryColor}
                  sx={{
                    "::placeholder": {
                      color: primaryColor,
                    },
                  }}
                />
                <InputGroup>
                  <Input
                    name="password"
                    color={primaryColor}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focusBorderColor={primaryColor}
                    sx={{
                      "::placeholder": {
                        color: primaryColor,
                      },
                    }}
                    autoComplete="current-password"
                  />
                  <InputRightElement width="4.5rem">
                    <ChakraButton
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <ViewOffIcon color={primaryColor} />
                      ) : (
                        <ViewIcon color={primaryColor} />
                      )}
                    </ChakraButton>
                  </InputRightElement>
                </InputGroup>
                <Button disabled={isLoading} type="submit" width="full">
                  Sign Up
                </Button>
                {error && (
                  <Text color="red.500" textAlign="center">
                    {error}
                  </Text>
                )}
              </VStack>
            </form>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Signup;
