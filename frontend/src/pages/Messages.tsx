import { useState, useEffect } from 'react'
import { Box, Spinner, useTheme } from '@chakra-ui/react'
import { MyChats, ChatBox, PageLayout } from '../components'
import { useAuthContext } from '../hooks'

const Messages: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  const [fetchAgain, setFetchAgain] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <PageLayout user={user}>
      {isLoading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Spinner
            size="xl"
            color={primaryColor}
            thickness="5px"
            speed="1s"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
          />
        </Box>
      ) : (
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
      )}
    </PageLayout>
  )
}

export default Messages
