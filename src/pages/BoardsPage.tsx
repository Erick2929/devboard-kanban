import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useBoards } from '@/hooks/useBoards'
import { BoardCard } from '@/components/BoardCard'
import { AppHeader } from '@/components/AppHeader'
import type { Board } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export function BoardsPage() {
  const navigate = useNavigate()
  const { boards, loading, createBoard } = useBoards()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleBoardClick = (board: Board) => {
    navigate(`/boards/${board.id}`)
  }

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBoardName.trim()) return
    setCreating(true)
    await createBoard(newBoardName.trim())
    setNewBoardName('')
    setDialogOpen(false)
    setCreating(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Boards</h2>
          <Button onClick={() => setDialogOpen(true)} data-testid="new-board-button">
            <Plus className="h-4 w-4 mr-2" />
            New Board
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading boards...</p>
        ) : boards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No boards yet. Create your first board!</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
              <BoardCard key={board.id} board={board} onClick={handleBoardClick} />
            ))}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBoard}>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="board-name">Board Name</Label>
                <Input
                  id="board-name"
                  placeholder="e.g. My Project"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  data-testid="board-name-input"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating || !newBoardName.trim()}
                data-testid="create-board-submit"
              >
                {creating ? 'Creating...' : 'Create Board'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
