// import { createContext, useContext, useEffect, useState } from 'react'
// import { ChildrenProps } from '../types'
// import { useAuthContext } from '../hooks'

// export const ChatContext = createContext<any>(undefined)

// export const ChatProvider: React.FC<ChildrenProps> = ({ children }) => {
//   const [chatUser, setChatUser] = useState<any>(null)
//   const { state } = useAuthContext()
//   const { user } = state

//   useEffect(() => {
//     setChatUser(user)
//   }, [user])

//   return (
//     <ChatContext.Provider value={{ chatUser, setChatUser }}>
//       {children}
//     </ChatContext.Provider>
//   )
// }

// export const ChatState = () => useContext(ChatContext)

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Chat, ChildrenProps, User } from '../types'
import { io } from 'socket.io-client'
import { useAuthContext } from '../hooks'

let socket
const ENDPOINT = import.meta.env.VITE_API_URL

interface ChatState {
  selectedChat: Chat | null
  chats: Chat[]
  notification: any[]
}

interface ChatContextType {
  chatState: ChatState
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  setNotification: React.Dispatch<React.SetStateAction<any[]>>
  chatUser: User | null
  setChatUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const ChatContext = createContext<ChatContextType>({
  chatState: { selectedChat: null, chats: [], notification: [] },
  setSelectedChat: () => {},
  setChats: () => {},
  setNotification: () => {},
  chatUser: null,
  setChatUser: () => {},
})

export const ChatProvider: React.FC<ChildrenProps> = ({ children }) => {
  const { state: authState } = useAuthContext()
  const { user } = authState

  const [chatUser, setChatUser] = useState<any>(null)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [notification, setNotification] = useState<any[]>(() => {
    const savedNotifications = localStorage.getItem('notifications')
    return savedNotifications ? JSON.parse(savedNotifications) : []
  })

  useEffect(() => {
    setChatUser(user)
  }, [user])

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notification))
  }, [notification])

  const updateNotifications = (newMessageReceived: any) => {
    if (selectedChat && newMessageReceived.chat._id === selectedChat._id) return

    setNotification((prevNotifications) => {
      const exists = prevNotifications.find(
        (n) => n._id === newMessageReceived._id,
      )
      return exists
        ? prevNotifications
        : [...prevNotifications, newMessageReceived]
    })
  }

  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT, { auth: { token: user.token } })
      socket.emit('setup', user)

      socket.on('message received', (newMessageReceived) => {
        updateNotifications(newMessageReceived)
      })

      socket.on('connect_error', (err) => {
        console.error('Socket connect_error:', err.message)
      })
    }

    return () => {
      if (socket) {
        socket.off('message received')
        socket.disconnect()
      }
    }
  }, [user])

  const chatContextValue: ChatContextType = {
    chatState: { selectedChat, chats, notification },
    setSelectedChat,
    setChats,
    setNotification,
    chatUser,
    setChatUser,
  }

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatState = () => useContext(ChatContext)
