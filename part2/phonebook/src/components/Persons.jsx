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
  );
}

const Person = ({ person, deletePerson }) => {
  return (
    <p>
      {person.name} 
      {person.number} 
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </p>
  );
}

export default Persons;
