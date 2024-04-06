import { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { MyChats, ChatBox, PageLayout } from '../components'
import { useAuthContext } from '../hooks'

const Messages: React.FC = () => {
  const { state } = useAuthContext()
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
