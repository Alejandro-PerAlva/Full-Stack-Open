import React, { createContext, useReducer, useContext } from 'react'

// Estado inicial
const initialState = {
  user: null,
  tokenTimestamp: null,
}

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        tokenTimestamp: action.payload.tokenTimestamp,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokenTimestamp: null,
      }
    default:
      return state
  }
}

// Contexto
const UserContext = createContext()

export const useUser = () => useContext(UserContext)

// Provider
// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}
