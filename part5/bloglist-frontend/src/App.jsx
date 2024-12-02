import { useState, useEffect, useRef, React } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotification } from './contexts/NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const { notification, setNotification } = useNotification()
  const queryClient = useQueryClient()

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
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [])

  // Función para obtener blogs
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  // Mutación para crear un blog
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

  // Mutación para actualizar los likes de un blog
  const updateLikesMutation = useMutation({
    mutationFn: (blog) => blogService.update(blog.id, { ...blog, likes: blog.likes + 1 }),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      )
      setNotification('Liked blog successfully!', 'success')
    },
    onError: () => {
      setNotification('Error liking blog', 'error')
    },
  })

  // Mutación para eliminar un blog
  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: (id) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) => oldBlogs.filter((blog) => blog.id !== id))
      setNotification('Blog removed successfully!', 'success')
    },
    onError: () => {
      setNotification('Error removing blog', 'error')
    },
  })

  // Función de inicio de sesión
  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      window.localStorage.setItem('tokenTimestamp', new Date().getTime())
      setNotification('Logged in successfully!', 'success')
    } catch (error) {
      setNotification('Login failed', 'error')
    }
  }

  // Función de cierre de sesión
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
    window.localStorage.removeItem('tokenTimestamp')
    blogService.setToken(null)
    setNotification('Logged out successfully!', 'success')
  }

  // Funciones para manejar los blogs
  const addBlog = (newBlog) => {
    createBlogMutation.mutate(newBlog)
  }

  const updateBlogLikes = (blog) => {
    updateLikesMutation.mutate(blog)
  }

  const deleteBlog = (id) => {
    deleteBlogMutation.mutate(id)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <Togglable buttonLabel="New blog" ref={blogFormRef}>
            <button id="add-blog-button">New blog</button>
            <BlogForm addBlog={addBlog} />
          </Togglable>

          {blogs && blogs.map(blog =>
            <Blog key={blog.id}
                  blog={blog}
                  updateLikes={updateBlogLikes}
                  deleteBlog={deleteBlog}
            />)}
        </div>
      )}
    </div>
  )
}

export default App