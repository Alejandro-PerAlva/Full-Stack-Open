/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { useUser } from '../contexts/UserContext' // Importar el contexto del usuario

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [newComment, setNewComment] = useState('') // Estado para el nuevo comentario
  const navigate = useNavigate()
  const { state: userState } = useUser() // Obtener el usuario desde el contexto global
  const [canDelete, setCanDelete] = useState(false) // Estado independiente para ver si se puede eliminar

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await blogService.get(id)
        setBlog(blogData)
        // Verificar si el usuario logueado es el propietario del blog
        if (blogData.user && blogData.user.username === userState.user?.username) {
          setCanDelete(true)
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
      }
    }

    fetchBlog()
  }, [id, userState.user])

  const handleLike = async () => {
    if (!blog) return
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 }
      const updatedBlogData = await blogService.update(blog.id, updatedBlog)
      setBlog(updatedBlogData) // Actualizamos el estado del blog con los nuevos datos
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const handleDelete = async () => {
    if (!blog) return
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await blogService.remove(blog.id)
        navigate('/blogs') // Redirigir a la página de blogs después de eliminarlo
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const updatedBlog = await blogService.addComment(blog.id, newComment)
      setBlog(updatedBlog)
      setNewComment('') // Limpiar el campo de comentario
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  // Verificar si el blog aún no ha sido cargado
  if (!blog) {
    return <div>Loading...</div>
  }

  return (
    <div className="blog-detail">
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>
        URL:{" "}
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </p>
      <p>Likes: {blog.likes}</p>
      <button onClick={handleLike}>Like</button>
      <p>User: {blog.user ? blog.user.name : "Unknown user"}</p>
      {canDelete && <button onClick={handleDelete}>Delete</button>}
      <div className="comments">
        <h3>Comments</h3>
        <ul>
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment, index) => <li key={index}>{comment}</li>)
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
        <div className="comment-input">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
