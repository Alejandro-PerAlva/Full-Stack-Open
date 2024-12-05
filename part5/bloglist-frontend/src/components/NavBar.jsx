/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

const NavBar = ({ user }) => {
  return (
    <nav className="navbar">
      <div>
        <Link to="/blogs">Blogs</Link>
        <Link to="/users">Users</Link>
      </div>
      <div>
        {user && user.name ? (
          <Link to="/profile">{user.name}</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default NavBar
