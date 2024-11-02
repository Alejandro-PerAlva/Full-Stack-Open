// Blog.jsx
import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs }) => {
  const [showDetails, setShowDetails] = useState(false) // Estado para mostrar/ocultar detalles

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = () => {
    const updatedLikes = { likes: blog.likes + 1 }

    blogService.update(blog.id, updatedLikes)
      .then(updatedBlog => {
        setBlogs(prevBlogs => 
          prevBlogs.map(b => (b.id === updatedBlog.id ? updatedBlog : b))
        )
      })
      .catch(error => {
        console.error('Error updating likes:', error)
      })
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'show'} details
        </button>
      </div>
      {showDetails && (
        <div>
          <p>Likes: {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
        </div>
      )}
    </div>
  )
}

export default Blog
