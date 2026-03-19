import { render, screen, fireEvent } from '@testing-library/react'
import { BoardCard } from '../'
import { Board } from '@/types'

const mockBoard: Board = {
  id: '1',
  user_id: 'user-1',
  name: 'Test Board',
  color: '#6366f1',
  created_at: '2024-01-01T00:00:00Z',
}

describe('BoardCard', () => {
  it('renders board name', () => {
    render(<BoardCard board={mockBoard} onClick={vi.fn()} />)
    expect(screen.getByText('Test Board')).toBeInTheDocument()
  })

  it('has correct data-testid', () => {
    render(<BoardCard board={mockBoard} onClick={vi.fn()} />)
    expect(screen.getByTestId('board-card')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<BoardCard board={mockBoard} onClick={handleClick} />)
    fireEvent.click(screen.getByTestId('board-card'))
    expect(handleClick).toHaveBeenCalledWith(mockBoard)
  })
})
