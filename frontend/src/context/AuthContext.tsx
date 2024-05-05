import {
  createContext,
  useReducer,
  useState,
  useEffect,
  Dispatch,
  useCallback,
} from 'react'
import { User, ChildrenProps, Chat } from '../types'
import { io } from 'socket.io-client'

const ENDPOINT = import.meta.env.VITE_API_URL
let socket

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
  socket: any
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

  const updateNotifications = useCallback(
    (newMessageReceived) => {
      if (selectedChat && newMessageReceived.chat._id === selectedChat._id)
        return

      setNotification((prevNotifications) => {
        const exists = prevNotifications.find(
          (n) => n._id === newMessageReceived._id,
        )
        return exists
          ? prevNotifications
          : [...prevNotifications, newMessageReceived]
      })
    },
    [selectedChat],
  )

  useEffect(() => {
    if (state.user) {
      socket = io(ENDPOINT, { auth: { token: state.user.token } })
      socket.emit('setup', state.user)

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
  }, [state.user, updateNotifications])

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
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
