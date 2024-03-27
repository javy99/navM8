import { createContext, useContext, useEffect, useState } from 'react'
import { ChildrenProps } from '../types'
// import { useNavigate } from 'react-router-dom'

export const ChatContext = createContext<any>(undefined)

export const ChatProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [chatUser, setChatUser] = useState<any>(null)
  //   const navigate = useNavigate()

  useEffect(() => {
    const userInfo = localStorage.getItem('user')

    const userObj = userInfo ? JSON.parse(userInfo) : null
    setChatUser(userObj)

    // if (!userInfo) {
    //   navigate('/login')
    // }
  }, [])

  return (
    <ChatContext.Provider value={{ chatUser, setChatUser }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)
