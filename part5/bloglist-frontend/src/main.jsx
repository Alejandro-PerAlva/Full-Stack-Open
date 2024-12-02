import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { NotificationProvider } from './contexts/NotificationContext' // Importamos el provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Importamos React Query

// Crear una nueva instancia de QueryClient
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <QueryClientProvider client={queryClient}> {/* Proveemos el QueryClient */}
      <App />
    </QueryClientProvider>
  </NotificationProvider>
)
