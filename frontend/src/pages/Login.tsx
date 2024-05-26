import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Flex,
  Image,
  VStack,
  Input,
  Heading,
  Button as ChakraButton,
  Text,
  InputGroup,
  InputRightElement,
  useTheme,
  Spinner,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Button } from '../components'
import { useLogin } from '../hooks'
import AuthBgImage from '../assets/auth-bg.jpg'

interface ErrorResponse {
  response: {
    data: string
  }
}

const Login: React.FC = () => {
  const { error, isLoading, login } = useLogin()
  const navigate = useNavigate()
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()
    try {
      const success = await login(email, password)
      if (success) {
        navigate('/')
      }
    } catch (catchError) {
      const errorResponse = catchError as ErrorResponse
      console.error('Login failed', errorResponse.response.data)
    }
  }

  useEffect(() => {
    const img = new window.Image()
    img.src = AuthBgImage
    img.onload = () => setImageLoaded(true)
  }, [])

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box position="relative" width="full">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          minHeight="100vh"
          position="relative"
        >
          <Box
            width={{ md: '50%' }}
            display={{ base: 'none', md: 'block' }}
            position="relative"
            _before={{
              content: `""`,
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              backgroundColor: 'black',
              opacity: 0.3,
              zIndex: 1,
            }}
          >
            {!imageLoaded && (
              <Flex
                align="center"
                justify="center"
                position="absolute"
                top="0"
                left="0"
                height="100%"
                width="100%"
                zIndex="1"
                backgroundColor="blackAlpha.500"
              >
                <Spinner
                  size="xl"
                  color={primaryColor}
                  thickness="5px"
                  speed="1s"
                />
              </Flex>
            )}
            <Image
              src={AuthBgImage}
              alt="Background"
              objectFit="cover"
              objectPosition="left"
              width="100%"
              height="100vh"
              display={imageLoaded ? 'block' : 'none'}
            />
          </Box>

          <Flex
            width={{ base: '100%', md: '50%' }}
            align="center"
            justify="center"
          >
            <Box
              width="100%"
              maxWidth="md"
              borderRadius="lg"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
            >
              <form onSubmit={handleSubmit}>
                <VStack
                  spacing={4}
                  width="full"
                  px={{ base: 4, md: 8 }}
                  boxShadow="xl"
                  py={8}
                >
                  <Heading size="lg" color={primaryColor}>
                    Login
                  </Heading>
                  <Text color={primaryColor}>Welcome back!</Text>
                  <Input
                    name="email"
                    color={primaryColor}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    focusBorderColor={primaryColor}
                    sx={{
                      '::placeholder': {
                        color: primaryColor,
                      },
                    }}
                    autoComplete="email"
                  />
                  <InputGroup>
                    <Input
                      name="password"
                      color={primaryColor}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      focusBorderColor={primaryColor}
                      sx={{
                        '::placeholder': {
                          color: primaryColor,
                        },
                      }}
                      autoComplete="current-password"
                    />
                    <InputRightElement width="4.5rem">
                      <ChakraButton
                        h="1.75rem"
                        size="sm"
                        onClick={() =>
                          setShowPassword((prevState) => !prevState)
                        }
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
                    Login
                  </Button>
                  {error && (
                    <Text color="red.500" textAlign="center">
                      {error}
                    </Text>
                  )}
                  <Text
                    color={primaryColor}
                    textAlign="center"
                    textDecoration="underline"
                    mt={4}
                    fontWeight={500}
                  >
                    <Link to="/signup">Don't have an account? Sign Up</Link>
                  </Text>
                </VStack>
              </form>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default Login
