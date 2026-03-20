import type { Card as CardType } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface KanbanCardProps {
  card: CardType
}

export function KanbanCard({ card }: KanbanCardProps) {
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
      className="cursor-grab active:cursor-grabbing"
      data-testid="kanban-card"
    >
      <CardContent className="p-3 flex items-center gap-2">
        <GripVertical
          className="h-4 w-4 text-muted-foreground flex-shrink-0"
          {...attributes}
          {...listeners}
        />
        <span className="text-sm">{card.title}</span>
      </CardContent>
    </Card>
  )
}
