import React from 'react'
import { VStack, Heading, useTheme } from '@chakra-ui/react'
import PageLayout from './PageLayout'
import { useAuthContext } from '../hooks'

const About: React.FC = () => {
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  return (
    <PageLayout user={user}>
      <VStack align="stretch" mt={{ base: 12, md: 0 }} p={8}>
        <Heading as="h3" fontSize="1.5rem" color={primaryColor} mb={4}>
          About & How-to
        </Heading>
      </VStack>
    </PageLayout>
  )
}

export default About
