/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Link } from 'react-router-dom'

const NavBar = ({ user }) => {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyleType: 'none', margin: 0, padding: 0 }}>
        <li style={{ margin: '0 15px' }}>
          <Link to="/blogs">Blogs</Link>
        </li>
        <li style={{ margin: '0 15px' }}>
          <Link to="/users">Users</Link>
        </li>
        {user && (
          <li style={{ margin: '0 15px' }}>
            <Link to={`/users/${user.id}`}>Profile</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default NavBar
