import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'
import { useChatState } from '../context'

interface Props {
  fetchAgain: boolean
  setFetchAgain: any
}

const ChatBox: React.FC<Props> = ({ fetchAgain, setFetchAgain }) => {
  const { chatState } = useChatState()
  const { selectedChat } = chatState

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: '100%', md: '68%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
