/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
const UserProfile = ({ user, handleLogout }) => {
  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div className="user-profile-container">
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <h3>Your Blogs:</h3>
      <ul>
        {user.blogs && user.blogs.length > 0 ? (
          user.blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)
        ) : (
          <p>No blogs available</p>
        )}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default UserProfile
