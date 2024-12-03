/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await blogService.get(id)
        setBlog(blogData)
      } catch (error) {
        console.error('Error fetching blog:', error)
      }
    }

    fetchBlog()
  }, [id])

  // Verificar si el blog aún no ha sido cargado
  if (!blog) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
      <p>Likes: {blog.likes}</p>
      <p>User: {blog.user ? blog.user.name : 'Unknown user'}</p>
    </div>
  )
}

export default BlogDetail
