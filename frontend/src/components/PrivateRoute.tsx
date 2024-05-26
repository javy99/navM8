import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, Spinner, useTheme } from '@chakra-ui/react'
import { useAuthContext } from '../hooks'

interface Props {
  component: React.FC
}

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { state } = useAuthContext()
  const { user } = state
  const theme = useTheme()
  const primaryColor = theme.colors.primary

  const location = useLocation()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [timeoutReached, setTimeoutReached] = useState<boolean>(false)

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading || !state.user) {
    if (timeoutReached) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Spinner
          size="lg"
          color={primaryColor}
          thickness="5px"
          speed="1s"
          w={20}
          h={20}
          alignSelf="center"
          margin="auto"
        />
      </Box>
    )
  }

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Component {...rest} />
}

export default PrivateRoute
