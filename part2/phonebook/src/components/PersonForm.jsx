import React from 'react'
import PropTypes from 'prop-types'

const PersonForm = ({ addName, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

PersonForm.propTypes = {
  addName: PropTypes.func.isRequired,
  newName: PropTypes.string.isRequired,
  newNumber: PropTypes.string.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  handleNumberChange: PropTypes.func.isRequired,
};

export default PersonForm
