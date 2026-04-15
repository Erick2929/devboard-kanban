import type { Column, Card as CardType } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from '@/components/KanbanCard'
import { Trash2 } from 'lucide-react'

interface KanbanColumnProps {
  column: Column
  cards: CardType[]
  onDelete?: () => void
  onDeleteCard?: (cardId: string) => void
}

export function KanbanColumn({ column, cards, onDelete, onDeleteCard }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 bg-muted/50 rounded-lg p-3 gap-2 min-h-[200px] transition-colors group ${
        isOver ? 'bg-primary/10' : ''
      }`}
      data-testid="kanban-column"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{column.name}</h3>
        <div className="flex items-center gap-1">
          <Badge variant="secondary">{cards.length}</Badge>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-muted-foreground hover:text-destructive h-6 w-6"
              onClick={onDelete}
              data-testid="delete-column-button"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>
      <SortableContext
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onDelete={onDeleteCard ? () => onDeleteCard(card.id) : undefined}
          />
        ))}
      </SortableContext>
    </div>
  )
}
