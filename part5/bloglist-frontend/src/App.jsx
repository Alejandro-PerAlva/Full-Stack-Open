import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      fetchBlogs()
    }
  }, [])

  const fetchBlogs = () => {
    blogService.getAll()
      .then(blogs => setBlogs(blogs))
      .catch(error => showNotification('Error fetching blogs', 'error'))
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      fetchBlogs()
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

  const handleAddBlog = async (blogData) => {
    try {
      const newBlog = await blogService.create(blogData)
      setBlogs(blogs.concat(newBlog))
      showNotification('Blog added successfully!', 'success')
    } catch (error) {
      showNotification('Error adding blog', 'error')
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Blog Application</h1>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {user ? (
        <div>
          <p>{user.name} logged in <button className="logout-button" onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="create new blog">
            <NewBlogForm onAddBlog={handleAddBlog} />
          </Togglable>
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <Togglable buttonLabel="login">
          <LoginForm onLogin={handleLogin} />
        </Togglable>
      )}
    </div>
  )
}

export default App
