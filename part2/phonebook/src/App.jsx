import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState()
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log(error)
        showNotification('Failed to retrieve data from the server', 'error')
      });
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(person => person.name === newName)
    if (nameExists) {
      if (window.confirm(`${newName}`)) {
        const person = persons.find(n => n.name === newName)
        const updatedPerson = { ...person, number: newNumber }

        personService
          .update(person.id, updatedPerson)
          .then(returnedPerson => {
              console.log(returnedPerson)
              setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
              setNewName('')
              setNewNumber('')
              showNotification(`Updated ${returnedPerson.name}`, 'success')
            })
          .catch(error => {
            console.error(error);
            showNotification(`Error: ${newName} was already removed from server`, 'error')
            alert('Error updating person');
          });
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      }

      personService
        .create(nameObject)
        .then(initialPersons => {
          console.log('promise fulfilled')
          setPersons(persons.concat(initialPersons))
          setNewName('')
          setNewNumber('')
          showNotification(`Added ${initialPersons.name}`, 'success')
        })
        .catch(error => {
          console.error(error.response.data.error)
          showNotification(`Failed to add the new person ${error.response.data.error}`, 'error')
        })
    }
  }

  const deletePerson = id => {
    const person = persons.find(n => n.id === id)
    if(window.confirm(`Delete ${person.name}`)) {
      personService
        .erase(id)
        .then(initialPersons => {
          console.log(initialPersons);
          setPersons(persons.filter(n => n.id !== id))
          showNotification(`Deleted ${person.name}`, 'success')
        })
        .catch(error => {
          console.log(error);
          showNotification(`Error: ${person.name} was already deleted from the server`, 'error')
          setPersons(persons.filter(n => n.id !== id))
        })
      }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const personsToShow = searchTerm === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        addName={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
