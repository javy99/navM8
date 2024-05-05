import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
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
  useTheme,
  BoxProps,
  Badge,
} from '@chakra-ui/react'
import {
  BsFillMapFill,
  BsBookmarkHeartFill,
  BsFillPinMapFill,
  BsChatLeftFill,
  BsFillHouseDoorFill,
  BsFillInfoCircleFill,
  BsPersonCircle,
} from 'react-icons/bs'
import { IconType } from 'react-icons'
import { useSidebarContext } from '../context'
import { useAuthContext } from '../hooks'
import { User } from '../types'
import logo from '../assets/logo.svg'
import { fetchMyTours, fetchBookingsForTour } from '../services'

interface Props {
  user: User | null
}

interface NavLinkItem {
  icon: IconType
  label: string
  to: string
}

const Sidebar: React.FC<Props> = ({ user }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebarContext()
  const theme = useTheme()
  const { notification } = useAuthContext()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0)

  useEffect(() => {
    const fetchAndCountPendingApprovals = async () => {
      if (user) {
        const tours = await fetchMyTours()
        let totalPending = 0

        for (const tour of tours) {
          const bookings = await fetchBookingsForTour(tour._id)
          const pendingBookings = bookings.filter(
            (booking) => booking.status === 'PENDING',
          )
          totalPending += pendingBookings.length
        }

        setPendingApprovalsCount(totalPending)
      }
    }

    fetchAndCountPendingApprovals()
  }, [user])

  const commonStyles: BoxProps = {
    bg: primaryColor,
    color: whiteColor,
    position: 'sticky',
    pt: 4,
    pb: 6,
    pr: 6,
    pl: 6,
    top: 0,
    left: 0,
    h: '100vh',
    overflowY: 'auto',
  }

  const links: NavLinkItem[] = user
    ? [
        {
          icon: BsFillHouseDoorFill,
          label: 'Home',
          to: '/',
        },
        {
          icon: BsFillInfoCircleFill,
          label: 'About Us',
          to: '/about',
        },
        {
          icon: BsPersonCircle,
          label: 'Profile',
          to: '/profile',
        },
        {
          icon: BsChatLeftFill,
          label: 'Messages',
          to: '/chat',
        },
        {
          icon: BsFillMapFill,
          label: 'My Bookings',
          to: '/bookings',
        },
        {
          icon: BsBookmarkHeartFill,
          label: 'Favorites',
          to: '/favorites',
        },
        {
          icon: BsFillPinMapFill,
          label: 'My Tours',
          to: '/mytours',
        },
      ]
    : [
        {
          icon: BsFillHouseDoorFill,
          label: 'Home',
          to: '/',
        },
        {
          icon: BsFillInfoCircleFill,
          label: 'About Us',
          to: '/about',
        },
      ]

  const isSmallScreen = useBreakpointValue({ base: true, lg: false })

  const handleClick = () => {
    if (isSmallScreen) {
      toggleSidebar()
    }
  }

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
              style={{ textDecoration: 'none' }}
              onClick={handleClick}
            >
              {({ isActive }) => (
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  py={2}
                  px={4}
                  borderRadius="xl"
                  role="group"
                  cursor="pointer"
                  _hover={{
                    bg: whiteColor,
                    color: primaryColor,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)',
                  }}
                  bg={isActive ? whiteColor : 'transparent'}
                  color={isActive ? primaryColor : whiteColor}
                  fontWeight={isActive ? 'bold' : 'normal'}
                >
                  <Flex>
                    <Icon
                      as={link.icon}
                      mr="4"
                      w={{ base: 4, md: 5 }}
                      h={{ base: 4, md: 5 }}
                    />
                    <Text
                      fontSize={{ base: 'sm', md: 'md' }}
                      whiteSpace="nowrap"
                    >
                      {link.label}
                    </Text>
                  </Flex>

                  {link.label === 'My Tours' && pendingApprovalsCount > 0 && (
                    <Badge
                      ml={2}
                      colorScheme="red"
                      variant="solid"
                      w={5}
                      h={5}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {pendingApprovalsCount}
                    </Badge>
                  )}

                  {link.label === 'Messages' && notification.length > 0 && (
                    <Badge
                      ml={2}
                      colorScheme="red"
                      variant="solid"
                      w={5}
                      h={5}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {notification.length}
                    </Badge>
                  )}
                </Flex>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>
    </>
  )

  return (
    <>
      <Drawer isOpen={isSidebarOpen} placement="left" onClose={toggleSidebar}>
        <DrawerOverlay />
        <DrawerContent
          width={{ base: '75vw', sm: '60vw', md: '45vw', lg: '30vw' }}
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
        display={{ base: 'none', lg: 'block' }}
        {...commonStyles}
        minWidth="250px"
        pb={6}
        pl={6}
        pr={6}
        pt={4}
        width={{
          md: '250px',
          lg: '270px',
          xl: '280px',
        }}
      >
        <SidebarContent />
      </Box>
    </>
  )
}

export default Sidebar
