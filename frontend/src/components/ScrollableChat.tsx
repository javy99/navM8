import React from 'react'
import { Message } from '../types'
import ScrollableFeed from 'react-scrollable-feed'
import { useAuthContext } from '../hooks'
import { Avatar, Flex, Tooltip } from '@chakra-ui/react'
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../configs/ChatLogics'

interface Props {
  messages: Message[]
}

const ScrollableChat: React.FC<Props> = ({ messages }) => {
  const { state } = useAuthContext()
  const { user } = state

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <Flex key={m._id}>
            {(isSameSender(messages, m, i, user?._id) ||
              isLastMessage(messages, i, user?._id)) && (
              <Tooltip
                label={m.sender?.firstName}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.firstName}
                  src={m.sender.profilePictureURL}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user?._id ? '#BEE3F8' : '#B9F5D0'
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
              }}
            >
              {m.content}
            </span>
          </Flex>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
