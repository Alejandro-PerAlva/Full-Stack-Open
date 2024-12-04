/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogDetail from './components/BlogDetail'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
import UserProfile from './components/UserProfile'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotification } from './contexts/NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from './contexts/UserContext'
import NavBar from './components/NavBar'

const App = () => {
  const blogFormRef = useRef()
  const { notification, setNotification } = useNotification()
  const queryClient = useQueryClient()
  const { state, dispatch } = useUser()
  const [loading, setLoading] = useState(true) // Estado de carga

  // Comprobar si el usuario ya está autenticado
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    const tokenTimestamp = window.localStorage.getItem('tokenTimestamp')

    if (loggedUserJSON && tokenTimestamp) {
      const currentTime = new Date().getTime()
      if (currentTime - tokenTimestamp > 10 * 60 * 1000) {
        // Si el token ha caducado, eliminamos el usuario de localStorage
        window.localStorage.removeItem('loggedUser')
        window.localStorage.removeItem('tokenTimestamp')
        setLoading(false)
      } else {
        // Si el token es válido, cargamos el usuario
        const user = JSON.parse(loggedUserJSON)
        dispatch({
          type: 'SET_USER',
          payload: { user, tokenTimestamp: new Date().getTime() },
        })
        blogService.setToken(user.token)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [dispatch])

  // Cargar blogs y usuarios
  const { data: blogs, isLoading: loadingBlogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      return response.json()
    },
  })

  // Mutación para crear blogs
  const createBlogMutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog),
    onSuccess: (newBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) => [...oldBlogs, newBlog])
      blogFormRef.current.toggleVisibility()
      setNotification('Blog added successfully!', 'success')
    },
    onError: () => {
      setNotification('Error adding blog', 'error')
    },
  })

  // Manejo del login
  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      dispatch({
        type: 'SET_USER',
        payload: { user, tokenTimestamp: new Date().getTime() },
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      window.localStorage.setItem('tokenTimestamp', new Date().getTime())
      setNotification('Logged in successfully!', 'success')

      // Esperar 1 segundo antes de redirigir y recargar
      setTimeout(() => {
        window.location.reload()
        window.location.href = '/profile'
      })
    } catch (error) {
      setNotification('Login failed', 'error')
    }
  }

  // Manejo del logout
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('loggedUser')
    window.localStorage.removeItem('tokenTimestamp')
    blogService.setToken(null)
    setNotification('Logged out successfully!', 'success')
  }

  // No renderizar nada mientras los datos están siendo cargados
  if (loading || loadingBlogs || loadingUsers) return <div>Loading...</div>

  return (
    <Router>
      <div>
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <NavBar user={state.user} />
        <Routes>
          <Route
            path="/blogs"
            element={
              <div>
                <h2>Blogs</h2>
                {state.user && (
                  <Togglable buttonLabel="New blog" ref={blogFormRef}>
                    <BlogForm addBlog={(newBlog) => createBlogMutation.mutate(newBlog)} />
                  </Togglable>
                )}
                {blogs && blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <Blog
                      key={blog.id}
                      blog={blog}
                      updateLikes={(updatedBlog) =>
                        blogService.update(updatedBlog.id, { ...updatedBlog, likes: updatedBlog.likes + 1 })
                      }
                      deleteBlog={(id) => blogService.remove(id)}
                    />
                  ))
                ) : (
                  <p>No blogs available</p>
                )}
              </div>
            }
          />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/users" element={<UserList users={users} />} />
          <Route
            path="/users/:id"
            element={
              state.user ? <UserDetail users={users} /> : <Navigate replace to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              state.user ? (
                <UserProfile user={state.user} handleLogout={handleLogout} />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={<LoginForm handleLogin={handleLogin} />}
          />
          <Route path="/" element={<Navigate replace to="/blogs" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
