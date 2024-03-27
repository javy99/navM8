import { BsX } from 'react-icons/bs'
import { Badge } from '@chakra-ui/react'
import React from 'react'
import { User } from '../types'

interface Props {
  user: User
  handleFunction: any
  admin?: string | null
}

const UserBadgeItem: React.FC<Props> = ({ handleFunction, user, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
      display="flex"
      alignItems="center"
    >
      {user.firstName} {user.lastName}
      {admin === user._id && <span> (Admin)</span>}
      <BsX />
    </Badge>
  )
}

export default UserBadgeItem
