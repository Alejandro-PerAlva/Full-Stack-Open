const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const { message, type } = notification
  const notificationClass = type === 'error' ? 'error' : 'success';
  
  return (
    <div className={notificationClass}>
      {message}
    </div>
  );
};

export default Notification;
