import type { Card as CardType } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

interface KanbanCardProps {
  card: CardType
  onDelete?: () => void
}

export function KanbanCard({ card, onDelete }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing group relative"
      data-testid="kanban-card"
    >
      <CardContent className="p-3 flex items-center gap-2">
        <GripVertical
          className="h-4 w-4 text-muted-foreground flex-shrink-0"
          {...attributes}
          {...listeners}
        />
        <span className="text-sm flex-1">{card.title}</span>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-muted-foreground hover:text-destructive h-6 w-6 flex-shrink-0"
            onClick={onDelete}
            data-testid="delete-card-button"
          >
            <Trash2 size={14} />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
