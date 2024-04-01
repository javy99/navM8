import { useAuthContext } from '../hooks'
import PageLayout from './PageLayout'
import { Box } from '@chakra-ui/react'
// import { ChatState } from '../context'
import { MyChats, ChatBox } from '../components'
import { useState } from 'react'

const Messages: React.FC = () => {
  const { state } = useAuthContext()
  // const { chatUser } = ChatState()
  const { user } = state

  const [fetchAgain, setFetchAgain] = useState<boolean>(false)

  return (
    <PageLayout user={user}>
      <Box width="100%" mt={{ base: '60px', md: 0 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="100vh"
          bg="#efefef"
          p={2}
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </Box>
    </PageLayout>
  )
}

export default Messages
