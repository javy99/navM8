import { BsEyeFill } from 'react-icons/bs'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  //   FormControl,
  //   Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react'
import { useAuthContext } from '../hooks'
import { User } from '../types'
import UserBadgeItem from './UserBadgeItem'
import UserListItem from './UserListItem'
import FormField from './FormField'

interface Props {
  fetchMessages: () => void
  fetchAgain: boolean
  setFetchAgain: (value: boolean) => void
}

const UpdateGroupChatModal: React.FC<Props> = ({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState<string>()
  const [search, setSearch] = useState<string>('')
  const [searchResult, setSearchResult] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const toast = useToast()

  const { selectedChat, setSelectedChat, state } = useAuthContext()
  const { user } = state

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users?search=${query}`,
        config,
      )
      console.log(data)
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
      setLoading(false)
    }
  }

  const handleRename = async () => {
    if (!groupChatName || !selectedChat) {
      toast({
        title: 'Please enter a new Chat name!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
      return
    }

    try {
      setRenameLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config,
      )

      console.log(data)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error Occurred!',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
        setRenameLoading(false)
      }
    }
    setGroupChatName('')
  }

  const handleAddUser = async (user1) => {
    if (!selectedChat) {
      toast({
        title: 'No chat selected!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
      return
    }

    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'User Already in group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    if (!selectedChat || !user) {
      toast({
        title: 'No chat or user information available!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
      return
    }

    if (!selectedChat.groupAdmin || selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config,
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error Occurred!',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
      }
      setLoading(false)
    }
    setGroupChatName('')
  }

  const handleRemove = async (user1: User) => {
    if (!selectedChat || !user) {
      toast({
        title: 'Operation failed!',
        description: 'No chat selected or user is not logged in.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
      return
    }

    if (!selectedChat.groupAdmin) {
      toast({
        title: 'Operation failed!',
        description: 'Group admin information is missing.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config,
      )

      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)

      // toast ({
      //     title: 'User removed from group chat!',
      //     status: 'success',
      //     duration: 5000,
      //     isClosable: true,
      //     position: 'bottom',
      //     })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error Occured!',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
        setLoading(false)
      }
    }
    setGroupChatName('')
  }

  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<BsEyeFill />}
        onClick={onOpen}
        aria-label="View Group Chat"
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            {selectedChat ? selectedChat.chatName : 'Group Chat'}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat &&
                selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin?._id || null}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
            </Box>

            <FormField
              placeholder="Chat Name"
              isRequired={false}
              name="groupChatName"
              type="inputButton"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              buttonLabel="Update"
              onButtonClick={handleRename}
              mb={2}
              isLoading={renameLoading}
            />
            {/* 
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl> */}
            <FormField
              placeholder="Add User to group"
              isRequired={false}
              name="search"
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              mb={2}
            />
            {/* <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl> */}

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => user && handleRemove(user)}
              colorScheme="red"
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
