/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Link } from 'react-router-dom'

const UserList = ({ users }) => {
  return (
    <div className="user-list-container">
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
