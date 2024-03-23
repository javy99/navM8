import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Navbar, Sidebar } from '../components'

const PageLayout = ({ children, user }) => (
  <Flex minHeight="100vh" direction={{ base: 'column', md: 'row' }}>
    <Sidebar user={user} />
    <Flex direction="column" flex="1" overflowY="auto">
      <Navbar />
      {children}
    </Flex>
  </Flex>
)

export default PageLayout
