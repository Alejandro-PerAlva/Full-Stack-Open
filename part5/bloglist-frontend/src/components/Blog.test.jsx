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

    expect(screen.queryByText(/URL:/)).toBeNull()
    expect(screen.queryByText(/Likes:/)).toBeNull()

    const button = screen.getByText('show more')
    await userEvent.click(button)

    expect(screen.getByText(`URL: ${blog.url}`)).toBeInTheDocument()
    expect(screen.getByText(`Likes: ${blog.likes}`)).toBeInTheDocument()
  })

  it('calls the like event handler twice if the like button is clicked twice', async () => {
    const blog = {
      id: '1',
      title: 'Testing React Components',
      author: 'John Doe',
      url: 'https://example.com',
      likes: 5,
      user: { name: 'Test User' }
    }

    const mockUpdateLikes = vi.fn()

    render(<Blog blog={blog} updateLikes={mockUpdateLikes} deleteBlog={vi.fn()} />)

    const showMoreButton = screen.getByText('show more')
    await userEvent.click(showMoreButton)

    const likeButton = screen.getByText('like')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(mockUpdateLikes).toHaveBeenCalledTimes(2)
  })
})
