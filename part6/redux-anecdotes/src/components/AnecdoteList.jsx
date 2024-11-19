import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, updateVoteAnecdote } from '../services/anecdotes'
import { setNotification, useNotification } from '../context/NotificationContext'

const AnecdoteList = () => {
  const { dispatch } = useNotification() // Extraer `dispatch` desde el contexto
  const queryClient = useQueryClient()

  // Obtener anécdotas del servidor
  const { data: anecdotes, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
  })

  // Manejar la votación de anécdotas
  const voteMutation = useMutation({
    mutationFn: updateVoteAnecdote,
    onSuccess: (updatedAnecdote) => {
      // Actualizar manualmente la caché con la anécdota actualizada
      queryClient.setQueryData(['anecdotes'], (oldData) =>
        oldData.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      )
      // Mostrar notificación
      setNotification(dispatch, `You voted for '${updatedAnecdote.content}'`, 5) // Usar `setNotification` con `dispatch`
    },
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote)
  }

  if (isLoading) {
    return <div>Loading anecdotes...</div>
  }

  if (isError) {
    return <div>Anecdote service is not available due to server issues</div>
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
