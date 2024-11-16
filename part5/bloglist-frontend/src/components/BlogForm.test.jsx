import { React } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  it('calls addBlog with the correct details when a new blog is created', async () => {
    const mockAddBlog = vi.fn()

    render(<BlogForm addBlog={mockAddBlog} />)

    // Obtener los campos de entrada
    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const addButton = screen.getByRole('button', { name: 'add' })

    // Definir datos de prueba
    const testTitle = 'New Blog Title'
    const testAuthor = 'Author Name'
    const testUrl = 'https://example.com'

    // Llenar el formulario con datos de prueba
    await userEvent.type(titleInput, testTitle)
    await userEvent.type(authorInput, testAuthor)
    await userEvent.type(urlInput, testUrl)

    // Enviar el formulario
    await userEvent.click(addButton)

    // Verificar que el controlador fue llamado con los detalles correctos
    expect(mockAddBlog).toHaveBeenCalledWith({
      title: testTitle,
      author: testAuthor,
      url: testUrl
    })

    // Verificar que el controlador fue llamado solo una vez
    expect(mockAddBlog).toHaveBeenCalledTimes(1)
  })
})
