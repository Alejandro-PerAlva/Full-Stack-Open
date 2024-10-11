const Persons = ({ persons }) => {
    return (
      <div>
        {persons.map(person => 
          <Person key={person.id} person={person} />
        )}
      </div>
    )
  }
  
  const Person = ({ person }) => {
    return (
      <p>{person.name} {person.number}</p>
    )
  }
  
  export default Persons
  