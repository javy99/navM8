import React, { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button as ChakraButton,
  Flex,
  Stack,
  Text,
  useDisclosure,
  useTheme,
  Tooltip,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useToast,
  Spinner,
  Avatar,
  Icon,
} from '@chakra-ui/react'
import { BsSearch, BsPeopleFill, BsPlus } from 'react-icons/bs'
import { useAuthContext } from '../hooks'
import ChatLoading from './ChatLoading'
import { Chat, User } from '../types'
import GroupChatModal from './GroupChatModal'
import { getSender } from '../configs/ChatLogics'
import UserListItem from './UserListItem'
import Button from './Button'
import FormField from './FormField'
import { accessChat, fetchChats, searchUsers } from '../services'
import { useChatState } from '../context'

interface Props {
  fetchAgain: boolean
}

const MyChats: React.FC<Props> = ({ fetchAgain }) => {
  const { state } = useAuthContext()
  const { user } = state

  const { chatState, setSelectedChat, setNotification, setChats } =
    useChatState()
  const { selectedChat, chats, notification } = chatState

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  const [loadingChat, setLoadingChat] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<Array<User>>([])
  const [loggedUser, setLoggedUser] = useState<User | null>(user)
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    setLoggedUser(user)
  }, [user])

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      })
      return
    }

    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to search for users.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      })
      return
    }

    try {
      setLoading(true)
      const { data } = await searchUsers(search)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
    }
  }

  const handleAccessChat = async (userId: string) => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to access chats.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
      return
    }

    try {
      setLoadingChat(true)
      const { data } = await accessChat(userId)

      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([...chats, data])
      }

      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error fetching the chat!',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left',
        })
      }
    }
  }

  useEffect(() => {
    const fetchAllChats = async () => {
      try {
        const { data } = await fetchChats()
        setChats(data)
      } catch (error) {
        toast({
          title: 'Error Occurred!',
          description: 'Failed to Load the Chats',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left',
        })
      }
    }

    fetchAllChats()
  }, [fetchAgain])

  const hasNotification = (chatId) =>
    notification.some((n) => n.chat._id === chatId)

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderWidth="1px"
      borderRadius="lg"
    >
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth="3px"
            borderColor={primaryColor}
            color={primaryColor}
            textAlign="center"
          >
            Search Users
          </DrawerHeader>
          <DrawerBody pt={4} px={3}>
            <Box display="flex" pb={3} alignItems="center">
              <FormField
                isRequired={false}
                placeholder="Search..."
                name="search"
                type="inputButton"
                value={search}
                buttonLabel="Go"
                onButtonClick={handleSearch}
                mr={1}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user: User) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => user._id && handleAccessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner
                ml="auto"
                display="flex"
                color={primaryColor}
                speed="1s"
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderTopLeftRadius="lg"
        borderTopRightRadius="lg"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <ChakraButton variant="ghost" onClick={onOpen}>
            <BsSearch color={primaryColor} size={20} />
            <Text
              display={{ base: 'none', md: 'flex' }}
              px={4}
              color={primaryColor}
              fontSize={{ base: 'md', md: 'lg' }}
            >
              Search User
            </Text>
          </ChakraButton>
        </Tooltip>
      </Box>

      <Box
        p={5}
        px={5}
        fontSize={{ base: '28px', md: '30px' }}
        display="flex"
        flexWrap="wrap"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        borderTop={`3px solid ${primaryColor}`}
        borderBottom={`3px solid ${primaryColor}`}
      >
        <Text mb={1} color={primaryColor} fontSize="xl">
          Chats
        </Text>
        <GroupChatModal>
          <Button display="flex" rightIcon={<BsPlus size={25} />}>
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Flex
        flexDirection="column"
        bg="#f8f8f8"
        w="100%"
        h="100%"
        borderBottomLeftRadius="lg"
        borderBottomRightRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" gap={0}>
            {chats.map((chat: Chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat)
                  setNotification(
                    notification.filter((n) => n.chat._id !== chat._id),
                  )
                }}
                borderY="1px solid #e8e8e8"
                borderLeftWidth="5px"
                bg={
                  selectedChat === chat
                    ? '#E9F7F8'
                    : hasNotification(chat._id)
                      ? 'red.50'
                      : '#fff'
                }
                color="black"
                cursor="pointer"
                borderLeft={`5px solid ${
                  selectedChat === chat
                    ? primaryColor
                    : hasNotification(chat._id)
                      ? 'rgb(212, 19, 13)'
                      : 'transparent'
                }`}
                px={4}
                py={2}
                borderRadius="0"
                key={chat._id}
              >
                <Flex align="center" justifyContent="space-between">
                  <Flex align="center">
                    {!chat.isGroupChat ? (
                      chat.users
                        .filter((chatUser) => chatUser._id !== loggedUser?._id)
                        .map((user) => (
                          <Avatar
                            color={whiteColor}
                            key={user._id}
                            mr={3}
                            size="md"
                            cursor="pointer"
                            name={user?.username}
                            src={user.profilePictureURL}
                            fontWeight={500}
                          />
                        ))
                    ) : (
                      <Avatar
                        mr={3}
                        size="md"
                        icon={
                          <Icon as={BsPeopleFill} color="white" h={7} w={7} />
                        }
                        bg="gray.200"
                      />
                    )}
                    <Text fontWeight="500">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                  </Flex>

                  {hasNotification(chat._id) && (
                    <Badge ml="1" colorScheme="red" p={1}>
                      {
                        notification.filter((n) => n.chat._id === chat._id)
                          .length
                      }{' '}
                      new
                    </Badge>
                  )}
                </Flex>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Flex>
    </Box>
  )
}

export default MyChats
