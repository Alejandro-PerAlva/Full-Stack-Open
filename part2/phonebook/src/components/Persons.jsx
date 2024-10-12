const Persons = ({ persons }) => {
  return (
    <div>
      {persons && persons.length > 0 
        ? (persons.map((person, index) => 
          <Person key={person.id || index} person={person} />)) 
        : (<p>No persons available</p>
      )}
    </div>
  );
}

const Person = ({ person }) => {
  return (
    <p>{person.name} {person.number}</p>
  );
}

export default Persons;
