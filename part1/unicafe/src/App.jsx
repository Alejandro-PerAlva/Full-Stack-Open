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
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const headers = ["give feedback", "statistics"] 
  const types = ["good", "neutral", "bad"]
  const statisticsTypes = ["all", "average", "positive"]

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

  const all = () => {
    console.log(good + neutral + bad)
    return good + neutral + bad
  }

  const average = () => {
    console.log((good - bad) / all())
    if (all() === 0) return 0
    return (good - bad) / all()  
  }

  const positive = () => {
    console.log()
    return (good / all()) * 100
  }

  return (
    <div>
      <Header text={headers[0]} />
      <Button handleClick={increaseGood} text={types[0]} />
      <Button handleClick={increaseNeutral} text={types[1]} />
      <Button handleClick={increaseBad} text={types[2]} />
      <Header text={headers[1]} />
      <Display text={types[0]} value={good} />
      <Display text={types[1]} value={neutral} />
      <Display text={types[2]} value={bad} />
      <Display text={statisticsTypes[0]} value={all()} />
      <Display text={statisticsTypes[1]} value={average()} />
      <Display text={statisticsTypes[2]} value={positive()} />
    </div>
  )
}

export default App