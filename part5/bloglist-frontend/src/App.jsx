import { useState, useEffect, useRef, React } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    const tokenTimestamp = window.localStorage.getItem('tokenTimestamp')

    // Verificar si el token ha expirado (10 minutos)
    if (loggedUserJSON && tokenTimestamp) {
      const currentTime = new Date().getTime()
      if (currentTime - tokenTimestamp > 10 * 60 * 1000) {
        // Token expirado, limpiar el usuario
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
        showNotification('Error fetching blogs:', 'error')
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
      showNotification('Logged in successfully!', 'success')
    } catch (error) {
      showNotification('Login failed', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
    window.localStorage.removeItem('tokenTimestamp')
    blogService.setToken(null)
    showNotification('Logged out successfully!', 'success')
  }

  const addBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      showNotification('Blog added successfully!', 'success')
    } catch (error) {
      showNotification('Error adding blog:', 'error')
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
      showNotification('Liked blog successfully!', 'success')
    } catch (error) {
      showNotification('Error liking blog:', 'error')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification('Blog removed successfully!', 'success')
    } catch (error) {
      showNotification('Error removing blog:', 'error')
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

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

          <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
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
