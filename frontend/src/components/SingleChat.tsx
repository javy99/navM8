import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks'
import {
  Box,
  IconButton,
  Spinner,
  Text,
  useToast,
  useTheme,
  FormControl,
  Input,
  Heading,
  // Avatar,
} from '@chakra-ui/react'
import { BsArrowLeft } from 'react-icons/bs'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import { getSender, getSenderFull } from '../configs/ChatLogics'
import ProfileModal from './ProfileModal'
import { Message } from '../types'
import ScrollableChat from './ScrollableChat'
import { io } from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'
import { fetchMessages, sendMessage } from '../services'

const ENDPOINT = import.meta.env.VITE_API_URL
let socket, selectedChatCompare

interface Props {
  fetchAgain: boolean
  setFetchAgain: any
}

const SingleChat: React.FC<Props> = ({ fetchAgain, setFetchAgain }) => {
  const {
    state,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = useAuthContext()
  const { user } = state
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [newMessage, setNewMessage] = useState<string>('')
  const [socketConnected, setSocketConnected] = useState<boolean>(false)
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const [typing, setTyping] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const toast = useToast()

  const fetchMessagesHandler = async () => {
    if (!selectedChat || !user || !selectedChat._id || !user.token) return

    try {
      setLoading(true)
      const data = await fetchMessages(selectedChat._id, user.token)
      setMessages(data.data)
      setLoading(false)

      socket.emit('join chat', selectedChat._id)
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Load the Messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))

    return () => {
      socket.off('connected')
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    fetchMessagesHandler()

    selectedChatCompare = selectedChat

    socket.on('typing', ({ chatId }) => {
      if (selectedChat?._id === chatId) {
        setIsTyping(true)
      }
    })

    socket.on('stop typing', ({ chatId }) => {
      if (selectedChat?._id === chatId) {
        setIsTyping(false)
      }
    })

    return () => {
      socket.off('typing')
      socket.off('stop typing')
    }
  }, [selectedChat])

  useEffect(() => {
    const handleNewMessageReceived = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Give notification
        let exists = notification.find((n) => n._id === newMessageReceived._id)
        if (!exists) {
          setNotification([newMessageReceived, ...notification])
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived])
      }
    }

    socket.on('message received', handleNewMessageReceived)

    return () => {
      socket.off('message received', handleNewMessageReceived)
    }
  }, [notification, selectedChatCompare])

  const sendMessageHandler = async (e: any) => {
    if (e.key === 'Enter' && newMessage && selectedChat?._id && user?.token) {
      socket.emit('stop typing', selectedChat?._id)
      try {
        setNewMessage('')
        const response = await sendMessage(
          newMessage,
          selectedChat._id,
          user.token,
        )
        const messageData: Message = response.data
        socket.emit('new message', messageData)
        setMessages((prevMessages) => [...prevMessages, messageData])
      } catch (error) {
        toast({
          title: 'Error Occurred!',
          description: 'Failed to Send the Message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
      }
    }
  }

  const typingHandler = (e: any) => {
    setNewMessage(e.target.value)

    // typing indicator logic
    if (!socketConnected || !selectedChat?._id) return

    if (!typing) {
      setTyping(true)
      socket.emit('typing', { chatId: selectedChat._id })
    }

    let lastTypingTime = new Date().getTime()
    let timerLength = 3000
    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', { chatId: selectedChat._id })
        setTyping(false)
      }
    }, timerLength)
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Heading
            as="h2"
            size="md"
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
            color={primaryColor}
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<BsArrowLeft />}
              onClick={() => setSelectedChat(null)}
              aria-label="Back to chats"
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessagesHandler}
                />
              </>
            )}
          </Heading>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#e8e8e8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                color={primaryColor}
                thickness="3px"
                speed="1s"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessageHandler} isRequired my={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <> </>
              )}
              <Input
                variant="filled"
                bg="#e0e0e0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" mt={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
