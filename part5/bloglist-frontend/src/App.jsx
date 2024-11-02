import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()
  const loginFormRef = useRef()
  const tokenExpirationTimer = useRef(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      fetchBlogs(user.token)
      startTokenExpirationTimer()
    }
  }, [])

  const startTokenExpirationTimer = () => {
    if (tokenExpirationTimer.current) {
      clearTimeout(tokenExpirationTimer.current)
    }
    tokenExpirationTimer.current = setTimeout(() => {
      handleLogout()
      showNotification('Session expired. Please log in again.', 'error')
    }, 10 * 60 * 1000) // 10 minutos en milisegundos
  }

  const fetchBlogs = (token) => {
    if (token) {
      blogService.getAll()
        .then(blogs => setBlogs(blogs))
        .catch(error => showNotification('Error fetching blogs:', 'error'))
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()

    loginService
      .login({ username, password })
      .then(user => {
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
        fetchBlogs(user.token)
        showNotification('Logged in successfully!', 'success')
        loginFormRef.current.toggleVisibility()
        startTokenExpirationTimer() // Iniciar el temporizador de expiración después del login
      })
      .catch(error => showNotification('Login failed', 'error'))
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    clearTimeout(tokenExpirationTimer.current) // Limpiar el temporizador al cerrar sesión
    showNotification('Logged out successfully!', 'success')
  }

  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showNotification('Blog added successfully!', 'success')
        blogFormRef.current.toggleVisibility()
      })
      .catch(error => showNotification('Error adding blog:', 'error'))
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <div>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {user === null ? (
        <Togglable buttonLabel="log in" ref={loginFormRef}>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </Togglable>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>

          {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
      )}
    </div>
  )
}

export default App