import { createContext, useReducer, useState, useEffect, Dispatch } from 'react'
import { User, ChildrenProps, Chat } from '../types'

interface AuthState {
  user: User | null
}

interface AuthAction {
  type: string
  payload: User | null
}

export interface AuthContextType {
  state: AuthState
  dispatch: Dispatch<AuthAction>
  selectedChat: Chat | null
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>
  chats: Chat[]
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  notification: any[]
  setNotification: React.Dispatch<React.SetStateAction<any[]>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        user: null,
      }
    default:
      return state
  }
}

export const AuthContextProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  })

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [notification, setNotification] = useState<any[]>(() => {
    const savedNotifications = localStorage.getItem('notifications')
    return savedNotifications ? JSON.parse(savedNotifications) : []
  })

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notification))
  }, [notification])

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
