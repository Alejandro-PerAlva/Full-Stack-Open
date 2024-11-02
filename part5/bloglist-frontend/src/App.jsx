// App.js
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [showNewBlogForm, setShowNewBlogForm] = useState(false) // Estado para mostrar/ocultar el formulario

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      fetchBlogs(user.token)
    }
  }, [])

  const fetchBlogs = (token) => {
    if (token) {
      blogService.getAll()
        .then(blogs => setBlogs(blogs))
        .catch(error => showNotification('Error fetching blogs:', 'error'))
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      fetchBlogs(user.token)
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

  const handleAddBlog = (newBlog) => {
    blogService.create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showNotification('Blog added successfully!', 'success')
        setShowNewBlogForm(false) // Ocultar el formulario después de agregar el blog
      })
      .catch(error => showNotification('Error adding blog:', 'error'))
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const toggleNewBlogForm = () => {
    setShowNewBlogForm(!showNewBlogForm) // Alternar visibilidad del formulario
  }

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
          <LoginForm handleLogin={handleLogin} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <div>
          <button onClick={toggleNewBlogForm}>
            {showNewBlogForm ? 'Cancel' : 'Add a new blog'}
          </button>

          {showNewBlogForm && (
            <div>
              <h3>Add a new blog</h3>
              <NewBlogForm handleAddBlog={handleAddBlog} />
            </div>
          )}
          </div>
          <h3>Your blogs</h3>
          {blogs.map(blog => <Blog key={blog.id} blog={blog} setBlogs={setBlogs}/>)}
        </div>
      )}
    </div>
  )
}

export default App
