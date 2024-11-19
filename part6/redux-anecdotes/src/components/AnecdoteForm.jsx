import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNew } from '../services/anecdotes'
import { setNotification, useNotification } from '../context/NotificationContext'

const AnecdoteForm = () => {
  const { dispatch } = useNotification()
  const queryClient = useQueryClient()

  // Mutación para crear una nueva anécdota
  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      // Mostrar notificación cuando se agrega la anécdota
      setNotification(dispatch, `You added '${newAnecdote.content}'`, 5)
    },
    onError: (error) => {
      // Mostrar notificación de error si la creación falla
      setNotification(dispatch, `Error: ${error.response?.data?.error || 'Failed to add anecdote'}`, 5)
    },
  })

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    // Verificar longitud de la anécdota
    if (content.length < 5) {
      setNotification(dispatch, 'Anecdote must be at least 5 characters long', 5)
      return
    }

    // Ejecutar la mutación para agregar la anécdota
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
