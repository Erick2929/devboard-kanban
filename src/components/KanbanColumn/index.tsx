import type { Column, Card as CardType } from '@/types'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from '@/components/KanbanCard'
import { Plus } from 'lucide-react'

const COLUMN_DOT_COLORS = ['bg-blue-500', 'bg-amber-400', 'bg-green-500']

interface KanbanColumnProps {
  column: Column
  cards: CardType[]
}

export function KanbanColumn({ column, cards }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const dotColor = COLUMN_DOT_COLORS[column.position] ?? 'bg-gray-400'

  return (
    <div className="flex flex-col w-80 shrink-0" data-testid="kanban-column">
      <div className="flex items-center justify-between px-1 py-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1">
            <span>{column.name}</span>
            <span className="text-gray-400 font-normal">({cards.length})</span>
          </h3>
        </div>
        <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 min-h-[120px] rounded-xl transition-colors p-1 ${
          isOver ? 'bg-indigo-50/60' : ''
        }`}
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
