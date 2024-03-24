import React from 'react'
import { useAuthContext } from '../hooks'
import PageLayout from './PageLayout'
import { Heading, VStack, useTheme } from '@chakra-ui/react'

const Messages: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  return (
    <PageLayout user={user}>
      <VStack align="stretch" p={8} mt={{ base: 12, md: 0 }}>
        <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
          Messages
        </Heading>
      </VStack>
    </PageLayout>
  )
}

export default Messages
