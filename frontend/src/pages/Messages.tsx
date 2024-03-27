import { useAuthContext } from '../hooks'
import PageLayout from './PageLayout'
import { Box, useTheme } from '@chakra-ui/react'
// import { ChatState } from '../context'
import { SideDrawer, MyChats, ChatBox } from '../components'
import { useState } from 'react'

const Messages: React.FC = () => {
  const { state } = useAuthContext()
  // const { chatUser } = ChatState()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary
  const [fetchAgain, setFetchAgain] = useState<boolean>(false)

  return (
    // <PageLayout user={user}>
    //   <VStack align="stretch" p={8} mt={{ base: 12, md: 0 }}>
    //     <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
    //       Chat Page
    //     </Heading>
    //     <VStack align="stretch" spacing={4}></VStack>
    //   </VStack>
    // </PageLayout>

    <PageLayout user={user}>
      <Box width="100%">
        {user && <SideDrawer />}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="100vh"
          bg={primaryColor}
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
