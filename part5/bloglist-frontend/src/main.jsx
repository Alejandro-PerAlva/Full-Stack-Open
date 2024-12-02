import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { NotificationProvider } from './contexts/NotificationContext' // Importamos el provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <App />
  </NotificationProvider>
)
