import { render, screen, fireEvent } from '@testing-library/react'
import { KanbanColumn } from '../'
import type { Column, Card } from '@/types'

// Mock dnd-kit since it requires a DndContext
vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
}))
vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  verticalListSortingStrategy: {},
}))
vi.mock('@/components/KanbanCard', () => ({
  KanbanCard: ({ card, onDelete }: { card: Card; onDelete?: () => void }) => (
    <div data-testid="kanban-card">
      {card.title}
      {onDelete && <button data-testid="delete-card-button" onClick={onDelete}>Delete</button>}
    </div>
  ),
}))

const mockColumn: Column = {
  id: 'col-1',
  board_id: 'board-1',
  name: 'To Do',
  position: 0,
  created_at: '2024-01-01T00:00:00Z',
}

const mockCards: Card[] = [
  {
    id: 'card-1',
    column_id: 'col-1',
    title: 'Test Card',
    color: '#ffffff',
    position: 0,
    created_at: '2024-01-01T00:00:00Z',
  },
]

describe('KanbanColumn', () => {
  it('renders column name', () => {
    render(<KanbanColumn column={mockColumn} cards={[]} />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('has correct data-testid', () => {
    render(<KanbanColumn column={mockColumn} cards={[]} />)
    expect(screen.getByTestId('kanban-column')).toBeInTheDocument()
  })

  it('renders cards', () => {
    render(<KanbanColumn column={mockColumn} cards={mockCards} />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
  })

  it('renders delete column button when onDelete prop is provided', () => {
    render(<KanbanColumn column={mockColumn} cards={[]} onDelete={vi.fn()} />)
    expect(screen.getByTestId('delete-column-button')).toBeInTheDocument()
  })

  it('calls onDelete when delete column button is clicked', () => {
    const handleDelete = vi.fn()
    render(<KanbanColumn column={mockColumn} cards={[]} onDelete={handleDelete} />)
    fireEvent.click(screen.getByTestId('delete-column-button'))
    expect(handleDelete).toHaveBeenCalled()
  })

  it('propagates onDeleteCard to card delete buttons', () => {
    const handleDeleteCard = vi.fn()
    render(<KanbanColumn column={mockColumn} cards={mockCards} onDeleteCard={handleDeleteCard} />)
    fireEvent.click(screen.getByTestId('delete-card-button'))
    expect(handleDeleteCard).toHaveBeenCalledWith('card-1')
  })
})
