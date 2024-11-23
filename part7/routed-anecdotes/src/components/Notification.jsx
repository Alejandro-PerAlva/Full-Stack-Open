/* eslint-disable react/prop-types */
const Notification = ({ message }) => {
    if (!message) return null
  
    return (
      <div style={{ border: 'solid', padding: 10, marginBottom: 10 }}>
        {message}
      </div>
    )
  }
  
  export default Notification
  