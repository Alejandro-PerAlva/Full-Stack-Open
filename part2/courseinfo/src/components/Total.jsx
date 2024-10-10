const Total = ( {parts} ) => {
    const total = parts.map(part => part.exercises).reduce((sum, value) => sum + value, 0)
    console.log(total);
    return <p>total of {total} exercises</p> 
}

export default Total 