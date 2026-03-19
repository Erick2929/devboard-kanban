import { render, screen } from '@testing-library/react'
import { KanbanColumn } from '../'
import { Column, Card } from '@/types'

// Mock dnd-kit since it requires a DndContext
vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
}))
vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  verticalListSortingStrategy: {},
}))
vi.mock('@/components/KanbanCard', () => ({
  KanbanCard: ({ card }: { card: Card }) => (
    <div data-testid="kanban-card">{card.title}</div>
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
})
