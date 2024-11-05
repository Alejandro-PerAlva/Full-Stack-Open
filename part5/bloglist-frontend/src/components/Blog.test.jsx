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
})
