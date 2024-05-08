import React from 'react'
// import { ChildrenProps } from '../types'
import { useAuthContext } from '../hooks'
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state } = useAuthContext()
  const location = useLocation()
  console.log(location)

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Component {...rest} />
}

export default PrivateRoute
