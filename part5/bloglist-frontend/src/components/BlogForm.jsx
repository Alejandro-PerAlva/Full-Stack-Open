import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
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
  )
}

export default BlogForm