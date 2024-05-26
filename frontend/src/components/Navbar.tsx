import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Flex,
  Text,
  HStack,
  Icon,
  IconButton,
  Image,
  useBreakpointValue,
  useTheme,
  Link,
} from '@chakra-ui/react'
import { BsPersonCircle, BsList } from 'react-icons/bs'
import { useProfilePhoto, useSidebarContext } from '../context'
import { useAuthContext, useLogout } from '../hooks'
import Button from './Button'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useLogout()
  const { state } = useAuthContext()
  const { user } = state
  const { toggleSidebar } = useSidebarContext()
  const { photo } = useProfilePhoto()

  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  const handleLogoutClick = () => {
    logout()
    navigate('/')
  }

  const navPadding = useBreakpointValue({ base: 2, md: 4 })
  const iconSize = useBreakpointValue({ base: '2.5rem', md: '2.6rem' })
  const isMobile = useBreakpointValue({ base: true, sm: false })

  return (
    <Flex
      as="nav"
      height="60px"
      alignItems="center"
      px={navPadding}
      boxShadow="md"
      bg={whiteColor}
      position={{ base: 'fixed', md: 'static' }}
      top={0}
      left={0}
      right={0}
      w="full"
      zIndex={100}
    >
      <IconButton
        display={{ base: 'flex', lg: 'none' }}
        icon={<BsList color={whiteColor} size="25px" />}
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
            <Link onClick={() => navigate('/profile')}>
              {photo ? (
                <Image
                  borderRadius="full"
                  boxSize={iconSize}
                  src={photo}
                  alt="Profile photo"
                  objectFit="cover"
                  objectPosition="center"
                />
              ) : (
                <Icon
                  as={BsPersonCircle}
                  boxSize={iconSize}
                  color="rgba(0, 0, 0, 0.3)"
                />
              )}
            </Link>
            {!isMobile && (
              <Link
                onClick={() => navigate('/profile')}
                _hover={{
                  textDecoration: 'none',
                }}
              >
                <Text color={primaryColor} fontWeight={600}>
                  {user.email}
                </Text>
              </Link>
            )}
            <Button onClick={handleLogoutClick}>Logout</Button>
          </>
        )}
        {!user && (
          <>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </>
        )}
      </HStack>
    </Flex>
  )
}

export default Navbar
