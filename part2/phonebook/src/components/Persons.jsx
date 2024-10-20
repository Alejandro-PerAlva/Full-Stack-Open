import React from 'react'
import PropTypes from 'prop-types'

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons && persons.length > 0
        ? (persons.map((person, index) => (
          <Person
            key={person.id || index}
            person={person}
            deletePerson={deletePerson}
          />
        )))
        : (<p>No persons available</p>
      )}
    </div>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <p>
      {person.name}
      {person.number}
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </p>
  )
}

Persons.propTypes = {
  persons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ).isRequired,
  deletePerson: PropTypes.func.isRequired,
}

Person.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
  }).isRequired,
  deletePerson: PropTypes.func.isRequired,
}

export default Persons
