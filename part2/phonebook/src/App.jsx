import { useState, useEffect } from 'react'
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
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
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
              setSuccessMessage(`Updated ${returnedPerson.name}`)
              setTimeout(() => {
                setSuccessMessage(null)
              }, 5000)
            })
          .catch(error => {
            console.error(error);
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
          setSuccessMessage(`Added ${initialPersons.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.error(error);
          alert('Error creating person');
        });
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
        })
        .catch(error => {
          console.log(error);
          alert(
            `the person '${person.content}' was already deleted from server`
          )
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
      <Notification message={successMessage} />
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
