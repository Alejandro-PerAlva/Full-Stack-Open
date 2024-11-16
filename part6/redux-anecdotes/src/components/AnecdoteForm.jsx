import { useDispatch } from 'react-redux'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotification(`You added '${content}'`)) 

    setTimeout(() => {
      dispatch(clearNotification()) 
    }, 5000)
  }

  return (
    <form onSubmit={addAnecdote}>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
