import { Box } from '@chakra-ui/react'
import { useAuthContext } from '../hooks'
import SingleChat from './SingleChat'

interface Props {
  fetchAgain: boolean
  setFetchAgain: any
}

const ChatBox: React.FC<Props> = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useAuthContext()

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
