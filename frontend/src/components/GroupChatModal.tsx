import {
  Button,
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
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAuthContext } from '../hooks'
import FormField from './FormField'
import axios from 'axios'
import UserListItem from './UserListItem'
import { User } from '../types'
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const { state, chats, setChats } = useAuthContext()
  const { user } = state

  const handleSearch = async (query: string) => {
    setSearch(query)

    if (!query) return

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
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast({
        title: 'Error Occured!',
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
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      )

      setChats([data, ...chats])
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
        title: 'Error Occured!',
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormField
              name="groupChatName"
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              isRequired={false}
              onChange={(e) => setGroupChatName(e.target.value)}
              mb={1}
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
              <Spinner />
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
            <Button colorScheme="blue" onClick={handleSubmit}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
