import { useState } from 'react'

const Blog = ({ blog, updateLikes }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    updateLikes(blog)
  }

  return (
    <div>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'show less' : 'show more'}
        </button>
      </div>
      {visible && (
        <div>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>User: {blog.user.name}</p>
        </div>
      )}
    </div>
  )
}

export default Blog