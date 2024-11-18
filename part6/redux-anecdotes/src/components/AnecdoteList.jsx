import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, updateVoteAnecdote } from '../services/anecdotes'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
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
      dispatch(setNotification(`You voted for '${updatedAnecdote.content}'`, 5))
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
