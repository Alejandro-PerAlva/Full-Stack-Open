import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [notification, setNotification] = useState(null)

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
        .catch(error => showNotification('Error fetching blogs:', 'error')) // Muestra notificación en caso de error
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()
    console.log('Logging in with', username, password)

    loginService
      .login({ username, password })
      .then(user => {
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
        fetchBlogs(user.token)
        showNotification('Logged in successfully!', 'success') // Notificación de éxito
      })
      .catch(error => showNotification('Login failed', 'error')) // Notificación de error
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    showNotification('Logged out successfully!', 'success') // Notificación de éxito
  }

  const handleAddBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      user: user.id
    }

    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
        showNotification('Blog added successfully!', 'success') // Notificación de éxito
      })
      .catch(error => showNotification('Error adding blog:', 'error')) // Notificación de error
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
          
          <h3>Add a new blog</h3>
          <form onSubmit={handleAddBlog}>
            <div>
              title
              <input
                type="text"
                value={newBlogTitle}
                onChange={({ target }) => setNewBlogTitle(target.value)}
              />
            </div>
            <div>
              author
              <input
                type="text"
                value={newBlogAuthor}
                onChange={({ target }) => setNewBlogAuthor(target.value)}
              />
            </div>
            <div>
              url
              <input
                type="text"
                value={newBlogUrl}
                onChange={({ target }) => setNewBlogUrl(target.value)}
              />
            </div>
            <button type="submit">add</button>
          </form>
          {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
      )}
    </div>
  )
}

export default App