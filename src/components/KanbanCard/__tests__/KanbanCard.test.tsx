import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanCard } from '../'
import type { Card } from '@/types'

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))
vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}))

const mockCard: Card = {
  id: 'card-1',
  column_id: 'col-1',
  title: 'Test Task',
  color: '#ffffff',
  position: 0,
  created_at: '2024-01-01T00:00:00Z',
}

describe('KanbanCard', () => {
  it('renders card title', () => {
    render(<KanbanCard card={mockCard} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('has correct data-testid', () => {
    render(<KanbanCard card={mockCard} />)
    expect(screen.getByTestId('kanban-card')).toBeInTheDocument()
  })

  it('renders delete button when onDelete prop is provided', () => {
    render(<KanbanCard card={mockCard} onDelete={vi.fn()} />)
    expect(screen.getByTestId('delete-card-button')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn()
    render(<KanbanCard card={mockCard} onDelete={handleDelete} />)
    fireEvent.click(screen.getByTestId('delete-card-button'))
    expect(handleDelete).toHaveBeenCalled()
  })
})
