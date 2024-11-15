import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.trim() === '') return
    event.target.anecdote.value = ''
    const newAnecdote = {
      content,
      id: (100000 * Math.random()).toFixed(0),
      votes: 0
    }
    dispatch(createAnecdote(newAnecdote))
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create new anecdote</h2>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default AnecdoteForm
