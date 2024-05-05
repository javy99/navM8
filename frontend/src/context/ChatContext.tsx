import { createContext, useContext, useEffect, useState } from 'react'
import { ChildrenProps } from '../types'
import { useAuthContext } from '../hooks'
// import { useNavigate } from 'react-router-dom'

export const ChatContext = createContext<any>(undefined)

export const ChatProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [chatUser, setChatUser] = useState<any>(null)
  const { state } = useAuthContext()
  const { user } = state

  useEffect(() => {
    setChatUser(user)
  }, [user])

  return (
    <ChatContext.Provider value={{ chatUser, setChatUser }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)
