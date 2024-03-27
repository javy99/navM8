import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks'
import {
  Badge,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { BsPlus } from 'react-icons/bs'
import ChatLoading from './ChatLoading'
import { Chat } from '../types'
import GroupChatModal from './GroupChatModal'
import { getSender } from '../configs/ChatLogics'

interface Props {
  fetchAgain: boolean
}

const MyChats: React.FC<Props> = ({ fetchAgain }) => {
  const {
    state,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useAuthContext()
  const { user } = state

  const [loggedUser, setLoggedUser] = useState(user)

  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        config,
      )

      setChats(data)
    } catch (error) {
      console.error('Error fetching chats:', error)
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

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('user') || '{}'))
    fetchChats()
  }, [fetchAgain])

  // ChatLogics. Instead of username have first and last names

  const hasNotification = (chatId) => {
    return notification.some((n) => n.chat._id === chatId)
  }

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="xl">Chats</Text>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<BsPlus />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#f8f8f8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack
            overflowY="scroll"
            sx={{
              '&::-webkit-scrollbar': {
                width: '0px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(136, 136, 136, 0.281)',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            {chats.map((chat: Chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat)
                  setNotification(
                    notification.filter((n) => n.chat._id !== chat._id),
                  )
                }}
                cursor="pointer"
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Flex justify="space-between" align="center">
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {hasNotification(chat._id) && (
                    <Badge ml="1" colorScheme="red">
                      {
                        notification.filter((n) => n.chat._id === chat._id)
                          .length
                      }{' '}
                      {''} new
                    </Badge>
                  )}
                </Flex>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats
