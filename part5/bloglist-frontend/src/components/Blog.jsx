import { useState, React } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    updateLikes(blog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'show less' : 'show more'}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>User: {blog.user.name}</p>
          <button onClick={handleDelete}>remove</button>
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
  }).isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default Blog
