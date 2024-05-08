import { createContext, useReducer, Dispatch, useEffect } from 'react'
import { User, ChildrenProps } from '../types'
import { getUser } from '../services'

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser()
        if (user) {
          dispatch({ type: 'LOGIN', payload: user })
        } else {
          dispatch({ type: 'LOGOUT', payload: null })
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT', payload: null })
      }
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
