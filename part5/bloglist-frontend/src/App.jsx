import { useState, useEffect, useRef, React } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotification } from './contexts/NotificationContext' // Importamos el contexto de notificaciones

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const { notification, setNotification } = useNotification() // Usamos el hook del contexto para las notificaciones

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
        fetchBlogs(user.token)
      }
    }
  }, [])

  const fetchBlogs = async (token) => {
    if (token) {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        setNotification('Error fetching blogs:', 'error')
      }
    }
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      window.localStorage.setItem('tokenTimestamp', new Date().getTime())
      await fetchBlogs(user.token)
      setNotification('Logged in successfully!', 'success')
    } catch (error) {
      setNotification('Login failed', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
    window.localStorage.removeItem('tokenTimestamp')
    blogService.setToken(null)
    setNotification('Logged out successfully!', 'success')
  }

  const addBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setNotification('Blog added successfully!', 'success')
    } catch (error) {
      setNotification('Error adding blog:', 'error')
    }
  }

  const updateBlogLikes = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    try {
      await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => (b.id === blog.id ? updatedBlog : b)))
      setNotification('Liked blog successfully!', 'success')
    } catch (error) {
      setNotification('Error liking blog:', 'error')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setNotification('Blog removed successfully!', 'success')
    } catch (error) {
      setNotification('Error removing blog:', 'error')
    }
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {/* Solo muestra la notificación si existe */}
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

          {sortedBlogs.map(blog =>
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
