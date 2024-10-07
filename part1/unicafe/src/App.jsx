import { useState } from 'react'

const Header = ( {text} ) => {
  console.log(text)
  return <h1>{text}</h1>
}

const Button = ( {handleClick, text} ) => {
  console.log(handleClick, text)
  return <button onClick={handleClick}>{text}</button>
}

const Display = ( {text, value} ) => {
  console.log(text, value)
  return <p>{text} {value}</p>
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => {
    console.log(good)
    setGood(good+1)
  }

  const increaseNeutral = () => {
    console.log(neutral)
    setNeutral(neutral+1)
  }

  const increaseBad = () => {
    console.log(bad)
    setBad(bad+1)
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={increaseGood} text="good" />
      <Button handleClick={increaseNeutral} text="neutral" />
      <Button handleClick={increaseBad} text="bad" />
      <Header text="statistics" />
      <Display text="good" value={good} />
      <Display text="neutral" value={neutral} />
      <Display text="bad" value={bad} />
    </div>
  )
}

export default App