/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

const NavBar = ({ user }) => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f0f0f0' }}>
      <div>
        <Link style={{ margin: '0 15px' }} to="/blogs">Blogs</Link>
        <Link style={{ margin: '0 15px' }} to="/users">Users</Link>
      </div>
      <div>
        {user && user.name ? (
          <Link style={{ margin: '0 15px' }} to="/profile">{user.name}</Link>
        ) : (
          <Link style={{ margin: '0 15px' }} to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default NavBar
