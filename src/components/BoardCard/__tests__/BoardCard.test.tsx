import { render, screen, fireEvent } from '@testing-library/react'
import { BoardCard } from '../'
import type { Board } from '@/types'

vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AlertDialogTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>,
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => <div role="alertdialog">{children}</div>,
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  AlertDialogAction: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void; className?: string }) => <button onClick={onClick}>{children}</button>,
}))

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

  it('renders delete button when onDelete prop is provided', () => {
    render(<BoardCard board={mockBoard} onClick={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByTestId('delete-board-button')).toBeInTheDocument()
  })

  it('does not render delete button without onDelete prop', () => {
    render(<BoardCard board={mockBoard} onClick={vi.fn()} />)
    expect(screen.queryByTestId('delete-board-button')).not.toBeInTheDocument()
  })

  it('calls onDelete when confirmed in dialog', () => {
    const handleDelete = vi.fn()
    render(<BoardCard board={mockBoard} onClick={vi.fn()} onDelete={handleDelete} />)
    fireEvent.click(screen.getByTestId('delete-board-button'))
    fireEvent.click(screen.getByText('Delete'))
    expect(handleDelete).toHaveBeenCalled()
  })
})
