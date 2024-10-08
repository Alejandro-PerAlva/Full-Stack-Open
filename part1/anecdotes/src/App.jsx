import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))

  const selectRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const voteForAnecdote = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
    console.log(newPoints)
  }

  const getMaxVotedAnecdote = () => {
    const maxIndex = points.indexOf(Math.max(...points))
    return { anecdote: anecdotes[maxIndex], votes: points[maxIndex] }
  }

  const { anecdote: maxAnecdote, votes: maxVotes } = getMaxVotedAnecdote();

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <button onClick={voteForAnecdote}>Vote</button>
      <button onClick={selectRandomAnecdote}>Next Anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{maxAnecdote}</p>
      <p>This anecdote has {maxVotes} votes</p>
    </div>
  )
}

export default App