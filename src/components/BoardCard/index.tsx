import type { Board } from '@/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'

interface BoardCardProps {
  board: Board
  onClick: (board: Board) => void
  onDelete?: () => void
}

export function BoardCard({ board, onClick, onDelete }: BoardCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow group relative"
      onClick={() => onClick(board)}
      data-testid="board-card"
    >
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-muted-foreground hover:text-destructive h-7 w-7 z-10"
              onClick={(e) => e.stopPropagation()}
              data-testid="delete-board-button"
            >
              <Trash2 size={14} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete board?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all columns and cards in "{board.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <CardHeader>
        <div
          className="w-full h-2 rounded-full mb-2"
          style={{ backgroundColor: board.color }}
        />
        <CardTitle className="text-lg">{board.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}
