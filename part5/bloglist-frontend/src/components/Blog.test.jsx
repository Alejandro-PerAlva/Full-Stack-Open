import { React } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Blog from './Blog'

describe('Blog component', () => {
  it('renders title and author but not URL or likes by default', () => {
    const blog = {
      id: '1',
      title: 'Testing React Components',
      author: 'John Doe',
      url: 'https://example.com',
      likes: 5,
      user: { name: 'Test User' }
    }

    render(<
        Blog blog={blog} updateLikes={vi.fn()} deleteBlog={vi.fn()}
    />)

    expect(screen.getByText('Testing React Components John Doe')).toBeInTheDocument()

    const details = screen.queryByText(/URL:|Likes:/)
    expect(details).toBeNull()
  })

  it('shows URL and likes when the "show more" button is clicked', async () => {
    const blog = {
      id: '1',
      title: 'Testing React Components',
      author: 'John Doe',
      url: 'https://example.com',
      likes: 5,
      user: { name: 'Test User' }
    }

    render(<Blog blog={blog} updateLikes={vi.fn()} deleteBlog={vi.fn()} />)

    // Verificar que URL y Likes no se muestran por defecto
    expect(screen.queryByText(/URL:/)).toBeNull()
    expect(screen.queryByText(/Likes:/)).toBeNull()

    // Hacer clic en el botón para mostrar más detalles
    const button = screen.getByText('show more')
    await userEvent.click(button)

    // Verificar que URL y Likes se muestran después de hacer clic en "show more"
    expect(screen.getByText(`URL: ${blog.url}`)).toBeInTheDocument()
    expect(screen.getByText(`Likes: ${blog.likes}`)).toBeInTheDocument()
  })
})
