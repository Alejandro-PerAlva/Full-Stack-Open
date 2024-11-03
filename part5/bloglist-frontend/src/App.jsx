import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      fetchBlogs(user.token)
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      await fetchBlogs(user.token)
      showNotification('Logged in successfully!', 'success')
    } catch (error) {
      showNotification('Login failed', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
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

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
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

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>

          {sortedBlogs.map(blog => <Blog key={blog.id} blog={blog} updateLikes={updateBlogLikes}/>)}
        </div>
      )}
    </div>
  )
}

export default App