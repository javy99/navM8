import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Button } from '../components'
import { useLogin } from '../hooks'
import AuthBgImage from '../assets/hero-bg5.jpg'

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

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box position="relative" width="full">
        <Flex direction={{ base: 'column', md: 'row' }} minHeight="100vh">
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
            width={{ base: '100%', md: '50%' }}
            align="center"
            justify="center"
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width: '85%',
                maxWidth: 'md',
                padding: '32px',
                borderRadius: 'lg',
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
                      onClick={() => setShowPassword((prevState) => !prevState)}
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
              </VStack>
            </form>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default Login
