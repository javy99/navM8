import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Navbar, Sidebar } from '../components'
import { useAuthContext } from '../hooks'

function Messages() {
  const { state } = useAuthContext()
  const { user } = state

  return (
    <Flex minHeight="100vh" direction={{ base: 'column', md: 'row' }}>
      <Sidebar user={user} />
      <Flex direction="column" flex="1" overflowY="auto">
        <Navbar />
      </Flex>
    </Flex>
  )
}

export default Messages
