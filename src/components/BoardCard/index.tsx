import type { Board } from '@/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface BoardCardProps {
  board: Board
  onClick: (board: Board) => void
}

export function BoardCard({ board, onClick }: BoardCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(board)}
      data-testid="board-card"
    >
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
