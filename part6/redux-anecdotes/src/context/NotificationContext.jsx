import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export const setNotification = (dispatch, message, timeInSeconds) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: message })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, timeInSeconds * 1000)
  }
  