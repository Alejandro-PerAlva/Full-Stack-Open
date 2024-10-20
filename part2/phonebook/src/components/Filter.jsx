import React from 'react';
import PropTypes from 'prop-types';

const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      filter shown with: <input
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

Filter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
};

export default Filter
