import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNew } from '../services/anecdotes'
import { useNotification, setNotification } from '../context/NotificationContext'

const AnecdoteForm = () => {
  const { dispatch } = useNotification() // Extraer `dispatch` del contexto
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      setNotification(dispatch, `You added '${newAnecdote.content}'`, 5) // Usar `setNotification` con `dispatch`
    },
  })

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    event.target.anecdote.value = ''

    if (content.length < 5) {
      setNotification(dispatch, 'Anecdote must be at least 5 characters long', 5) // Usar `setNotification` con `dispatch`
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
