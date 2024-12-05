import { useState, useImperativeHandle, forwardRef, React } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility
  }))

  return (
    <div className="togglable-container">
      {!visible && (
        <button
          className="togglable-button"
          onClick={toggleVisibility}
        >
          {props.buttonLabel}
        </button>
      )}
      {visible && (
        <div>
          {props.children}
          <button
            className="togglable-button togglable-cancel-button"
            onClick={toggleVisibility}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Togglable
