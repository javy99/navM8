import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
  Box,
  useTheme,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAuthContext } from '../hooks'
import FormField from './FormField'
import Button from './Button'
import UserListItem from './UserListItem'
import { User } from '../types'
import UserBadgeItem from './UserBadgeItem'
import { searchUsers, createGroupChat } from '../services'

interface Props {
  children: React.ReactNode
}

const GroupChatModal: React.FC<Props> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const primaryColor = theme.colors.primary

  const toast = useToast()

  const { chats, setChats } = useAuthContext()

  const handleSearch = async (query: string) => {
    setSearch(query)

    if (!query) return

    try {
      setLoading(true)
      const { data } = await searchUsers(query)
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
      return
    }

    try {
      const { data } = await createGroupChat(
        groupChatName,
        selectedUsers.map((u) => u._id),
      )

      setChats([data, ...chats])
      // Reset the input fields and selected users
      setGroupChatName('')
      setSelectedUsers([])
      setSearch('')
      setSearchResult([])
      onClose()
      toast({
        title: 'Group Chat Created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Create the Group Chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
    }
  }

  const handleGroup = (userToAdd: User) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      })
      return
    }

    setSelectedUsers([...selectedUsers, userToAdd])
  }

  const handleDelete = (userToDelete: User) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToDelete._id),
    )
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
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
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton color={primaryColor} size="lg" />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormField
              name="groupChatName"
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              isRequired={false}
              onChange={(e) => setGroupChatName(e.target.value)}
              mb={2}
            />
            <FormField
              name="search"
              type="text"
              placeholder="Add Users"
              value={search}
              isRequired={false}
              onChange={(e) => handleSearch(e.target.value)}
              mb={2}
            />

            <Box width="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user: User) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {loading ? (
              <Spinner color={primaryColor} speed="1s" />
            ) : (
              searchResult
                .slice(0, 4)
                .map((user: User) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit} mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
