import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react'
import { User } from '../types'

interface Props {
  user: User
  handleFunction: any
}

const UserListItem: React.FC<Props> = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#e8e8e8"
      _hover={{ background: '38b2ac', color: 'white' }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.username}
        src={user.profilePictureURL}
      />
      <Box>
        {/* <Text>{user.username}</Text> */}
        <Text>
          {user.firstName} {user.lastName}
        </Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  )
}

export default UserListItem
