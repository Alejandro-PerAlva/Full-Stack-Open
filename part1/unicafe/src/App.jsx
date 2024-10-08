import { useState } from 'react'

const Header = ( {text} ) => {
  console.log(text)
  return <h1>{text}</h1>
}

const Button = ( {handleClick, text} ) => {
  console.log(handleClick, text)
  return <button onClick={handleClick}>{text}</button>
}

const StatisticLine  = ( {text, value} ) => {
  console.log(text, value)
  return <p>{text} {value}</p>
}

const Statistics = ( {types, statisticsTypes} ) => {  
  if (statisticsTypes[0].function === 0) return "No feedback given"
  return (
    <>
      <StatisticLine text={types[0].name} value={types[0].value} />
      <StatisticLine text={types[1].name} value={types[1].value} />
      <StatisticLine text={types[2].name} value={types[2].value} />
      <StatisticLine text={statisticsTypes[0].name} value={statisticsTypes[0].function} />
      <StatisticLine text={statisticsTypes[1].name} value={statisticsTypes[1].function} />
      <StatisticLine text={statisticsTypes[2].name} value={statisticsTypes[2].function} />
    </>
  )
}

const App = () => {
  
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
    if (all() === 0) return 0
    return (good / all()) * 100
  }
  
  const activityObject = {
    headers: ["give feedback", "statistics"],
    types: [
      {
        name: "good",
        value: good
      },
      {
        name: "neutral",
        value: good
      },
      {
        name: "bad",
        value: good
      }
    ],
    statisticsTypes: [
      {
        name: "all",
        function: all()
      },
      {
        name: "average",
        function: average()
      },
      {
        name: "positive",
        function: positive()
      }
    ]
  } 

  return (
    <div>
      <Header text={activityObject.headers[0]} />
      <Button handleClick={increaseGood} text={activityObject.types[0].name} />
      <Button handleClick={increaseNeutral} text={activityObject.types[1].name} />
      <Button handleClick={increaseBad} text={activityObject.types[2].name} />
      <Header text={activityObject.headers[1]} />
      <Statistics types={activityObject.types} statisticsTypes={activityObject.statisticsTypes}/>
    </div>
  )
}

export default App