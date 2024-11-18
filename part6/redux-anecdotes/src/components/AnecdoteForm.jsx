import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNew } from '../services/anecdotes'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch(setNotification(`You added '${newAnecdote.content}'`, 5))
    },
  })

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    if (content.length < 5) {
      dispatch(setNotification('Anecdote must be at least 5 characters long', 5))
      return
    }

    newAnecdoteMutation.mutate(content)
  }

  return (
    <form onSubmit={addAnecdote}>
      <div>
        <input name="anecdote" placeholder="Enter anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
