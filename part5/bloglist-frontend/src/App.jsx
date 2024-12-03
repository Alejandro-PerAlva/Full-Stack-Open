/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Blog from './components/Blog'
import BlogDetail from './components/BlogDetail'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    const tokenTimestamp = window.localStorage.getItem('tokenTimestamp')

    if (loggedUserJSON && tokenTimestamp) {
      const currentTime = new Date().getTime()
      if (currentTime - tokenTimestamp > 10 * 60 * 1000) {
        window.localStorage.removeItem('loggedUser')
        window.localStorage.removeItem('tokenTimestamp')
      } else {
        const user = JSON.parse(loggedUserJSON)
        dispatch({
          type: 'SET_USER',
          payload: { user, tokenTimestamp: new Date().getTime() },
        })
        blogService.setToken(user.token)
      }
    }
  }, [dispatch])

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
    } catch (error) {
      setNotification('Login failed', 'error')
    }
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    window.localStorage.removeItem('loggedUser')
    window.localStorage.removeItem('tokenTimestamp')
    blogService.setToken(null)
    setNotification('Logged out successfully!', 'success')
  }

  if (loadingBlogs || loadingUsers) return <div>Loading...</div>

  return (
    <Router>
      <div>
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {state.user === null ? (
          <LoginForm handleLogin={handleLogin} />
        ) : (
          <div>
            <h2>blogs</h2>
            <p>{state.user.name} logged in</p>
            <button onClick={handleLogout}>logout</button>
            <NavBar user={state.user} />
            <Routes>
              <Route
                path="/blogs"
                element={
                  <div>
                    <Togglable buttonLabel="New blog" ref={blogFormRef}>
                      <BlogForm addBlog={(newBlog) => createBlogMutation.mutate(newBlog)} />
                    </Togglable>
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
                element={<UserDetail users={users} />}
              />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
