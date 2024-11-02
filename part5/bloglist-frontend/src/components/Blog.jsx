import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="blog">
      <div className="blog-header">
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div className="blog-details">
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes} <button className="like-button">like</button></p>
          <p>Added by: {blog.user && blog.user.name}</p>
        </div>
      )}
    </div>
  )
}

export default Blog
