import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useTheme,
  useToast,
  Box,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import UserBadgeItem from './UserBadgeItem'
import { BsEyeFill } from 'react-icons/bs'
import {
  searchUsers,
  renameGroupChat,
  addUserToGroup,
  removeUserFromGroup,
} from '../services'
import { useAuthContext } from '../hooks'
import { User } from '../types'
import UserListItem from './UserListItem'
import FormField from './FormField'
import Button from './Button'

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
  const { selectedChat, setSelectedChat, state } = useAuthContext()
  const { user } = state
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const whiteColor = theme.colors.white

  const [renameLoading, setRenameLoading] = useState<boolean>(false)
  const [groupChatName, setGroupChatName] = useState<string>()
  const [searchResult, setSearchResult] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) return

    try {
      setLoading(true)
      const { data } = await searchUsers(query, user?.token)
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

    if (!user?.token) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to rename a chat.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    try {
      setRenameLoading(true)
      const { data } = await renameGroupChat(
        selectedChat._id,
        groupChatName,
        user?.token,
      )
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
      toast({
        title: 'Chat renamed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
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

  const handleAddUser = async (userToAdd) => {
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

    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: 'User Already in group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    if (!user?.token) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to add a user.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
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
      const { data } = await addUserToGroup(
        selectedChat._id,
        userToAdd._id,
        user.token,
      )
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
      toast({
        title: 'User added successfully',
        description: `${userToAdd.username} has been added to the chat.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
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

  const handleRemove = async (userToRemove: User) => {
    if (!selectedChat) {
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

    if (!user || !user.token) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to remove a user.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    if (!selectedChat._id || !userToRemove._id) {
      toast({
        title: 'Error',
        description: 'Missing chat or user information.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      return
    }

    try {
      setLoading(true)
      const { data } = await removeUserFromGroup(
        selectedChat._id,
        userToRemove._id,
        user.token,
      )

      userToRemove._id === user._id
        ? setSelectedChat(null)
        : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
      toast({
        title: 'User removed successfully',
        description: `${userToRemove.username} has been removed from the chat.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
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
        color={whiteColor}
        bgColor={primaryColor}
        _hover={{ bgColor: primaryColor }}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered={true}>
        <ModalOverlay bg="rgba(0,0,0,0.5)" />
        <ModalContent
          borderBottom="15px solid"
          borderColor={primaryColor}
          borderRadius="15px"
          overflow="hidden"
        >
          <ModalHeader
            bg="#F6FBFC"
            boxShadow="xl"
            color={primaryColor}
            fontWeight="bold"
            mb={5}
          >
            {selectedChat ? selectedChat.chatName : 'Group Chat'}
          </ModalHeader>

          <ModalCloseButton color={primaryColor} size="lg" />
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
            <FormField
              placeholder="Add User to group"
              isRequired={false}
              name="search"
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              mb={2}
            />
            {loading ? (
              <Spinner size="lg" color={primaryColor} speed="1s" />
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
            <Button onClick={() => user && handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
