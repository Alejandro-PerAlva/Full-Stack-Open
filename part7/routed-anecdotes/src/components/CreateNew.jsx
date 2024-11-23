/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateNew = ({ addNew, setNotification }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar que ningún campo esté vacío
    if (!content.value.trim() || !author.value.trim() || !info.value.trim()) {
      setNotification('All fields must be filled!')
      return
    }

    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    })
    setNotification(`A new anecdote "${content.value}" created!`)
    navigate('/')
  }

  const resetFields = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content <input {...content} reset={undefined} />
        </div>
        <div>
          author <input {...author} reset={undefined} />
        </div>
        <div>
          url for more info <input {...info} reset={undefined} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={resetFields}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
