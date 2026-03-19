import { Column, Card as CardType } from '@/types'
import { Badge } from '@/components/ui/badge'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from '@/components/KanbanCard'

interface KanbanColumnProps {
  column: Column
  cards: CardType[]
}

export function KanbanColumn({ column, cards }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 bg-muted/50 rounded-lg p-3 gap-2 min-h-[200px] transition-colors ${
        isOver ? 'bg-primary/10' : ''
      }`}
      data-testid="kanban-column"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{column.name}</h3>
        <Badge variant="secondary">{cards.length}</Badge>
      </div>
      <SortableContext
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </SortableContext>
    </div>
  )
}
