import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const { message, type } = notification;
  const notificationClass = type === 'error' ? 'error' : 'success';

  return (
    <div className={notificationClass}>
      {message}
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
};

export default Notification
