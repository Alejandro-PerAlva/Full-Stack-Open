import React, { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return { message: action.message, type: action.notificationType }
    case 'CLEAR_NOTIFICATION':
      return { message: null, type: null }
    default:
      return state
  }
}

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, { message: null, type: null })

  const setNotification = (message, notificationType) => {
    dispatch({ type: 'SET_NOTIFICATION', message, notificationType })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification: state, setNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
