import React, { useEffect, useRef, useState } from 'react'
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
  Tooltip,
} from '@chakra-ui/react'
import { io } from 'socket.io-client'
import Lottie from 'react-lottie'
import { BsArrowLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks'
import animationData from '../animations/typing.json'
import ScrollableChat from './ScrollableChat'
import { getSender, getSenderFull } from '../configs/ChatLogics'
import { fetchMessages, sendMessage } from '../services'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import ProfileModal from './ProfileModal'
import { Message } from '../types'
import { useChatState } from '../context'

const ENDPOINT = import.meta.env.VITE_API_URL
let socket
let selectedChatCompare

interface Props {
  fetchAgain: boolean
  setFetchAgain: any
}

const SingleChat: React.FC<Props> = ({ fetchAgain, setFetchAgain }) => {
  const { state } = useAuthContext()
  const { user } = state

  const { chatState, setSelectedChat, setNotification } = useChatState()
  const { selectedChat, notification } = chatState

  const theme = useTheme()
  const primaryColor = theme.colors.primary

  const [socketConnected, setSocketConnected] = useState<boolean>(false)
  const [newMessage, setNewMessage] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [typing, setTyping] = useState<boolean>(false)

  const typingTimeoutRef = useRef<any>()

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const toast = useToast()

  const fetchMessagesHandler = async () => {
    if (!selectedChat || !user || !selectedChat._id) return

    try {
      setLoading(true)
      const data = await fetchMessages(selectedChat._id)
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
    socket = io(ENDPOINT, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))

    return () => {
      socket.off('connected')
      socket.disconnect()
    }
  }, [user])

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
        const exists = notification.find(
          (n) => n._id === newMessageReceived._id,
        )
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
    if (e.key === 'Enter' && newMessage && selectedChat?._id) {
      socket.emit('stop typing', selectedChat?._id)
      try {
        setNewMessage('')
        const response = await sendMessage(newMessage, selectedChat._id)
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

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop typing', { chatId: selectedChat._id })
      setTyping(false)
    }, 3000)
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
                <Tooltip
                  label={`View ${selectedChat.users.find((u) => u._id !== user?._id)?.firstName}'s Profile`}
                  hasArrow
                  placement="bottom-end"
                >
                  <Link
                    style={{ textAlign: 'center' }}
                    to={`/users/${selectedChat.users.find((u) => u._id !== user?._id)?._id ?? '#'}`}
                  >
                    <b>{getSender(user, selectedChat.users)}</b>
                  </Link>
                </Tooltip>
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
