/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useParams } from 'react-router-dom'

const UserDetail = ({ users }) => {
  const { id } = useParams()
  const user = users?.find((user) => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Blogs:</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetail
