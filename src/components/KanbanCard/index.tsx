import type { Card as CardType } from '@/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MessageSquare, CheckCircle2 } from 'lucide-react'

type PriorityKey = 'important' | 'high' | 'ok' | 'meh' | 'low'

const PRIORITIES: Record<PriorityKey, { label: string; className: string }> = {
  important: { label: 'Important', className: 'text-violet-700 bg-violet-100' },
  high: { label: 'High Priority', className: 'text-red-600 bg-red-100' },
  ok: { label: 'OK', className: 'text-green-700 bg-green-100' },
  meh: { label: 'Meh', className: 'text-gray-500 bg-gray-100' },
  low: { label: 'Not that important', className: 'text-orange-600 bg-orange-100' },
}

const COLOR_TO_PRIORITY: Record<string, PriorityKey> = {
  '#6366f1': 'important',
  '#8b5cf6': 'important',
  '#ef4444': 'high',
  '#22c55e': 'ok',
  '#f97316': 'low',
  '#3b82f6': 'meh',
}

const AVATAR_COLORS = [
  'bg-rose-400', 'bg-violet-400', 'bg-blue-400',
  'bg-emerald-400', 'bg-amber-400', 'bg-cyan-400', 'bg-pink-400',
]

function hashId(id: string): number {
  return [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

function getPriority(card: CardType): PriorityKey {
  return COLOR_TO_PRIORITY[card.color?.toLowerCase()] ?? (
    (['important', 'high', 'ok', 'meh', 'low'] as PriorityKey[])[hashId(card.id) % 5]
  )
}

function getProgress(id: string): number {
  return [0, 0, 30, 52, 70][hashId(id) % 5]
}

interface KanbanCardProps {
  card: CardType
}

export function KanbanCard({ card }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const priority = getPriority(card)
  const { label: priorityLabel, className: priorityClassName } = PRIORITIES[priority]
  const progress = getProgress(card.id)
  const avatarCount = (hashId(card.id) % 3) + 1
  const commentCount = ((card.id.charCodeAt(0) + card.id.charCodeAt(1)) % 30) + 1
  const taskCount = ((card.id.charCodeAt(2) + card.id.charCodeAt(3)) % 200) + 10

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl border border-gray-100 p-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
      data-testid="kanban-card"
      {...attributes}
      {...listeners}
    >
      <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 ${priorityClassName}`}>
        {priorityLabel}
      </span>

      <h4 className="text-sm font-semibold text-gray-800 mb-4 leading-snug">{card.title}</h4>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-400">Progress</span>
          <span className={`text-xs font-medium ${progress === 0 ? 'text-gray-500' : 'text-gray-700'}`}>
            {progress}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              progress >= 50 ? 'bg-amber-400' : 'bg-indigo-500'
            }`}
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {Array.from({ length: avatarCount }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold ${
                AVATAR_COLORS[(card.id.charCodeAt(i) + i) % AVATAR_COLORS.length]
              } ${i > 0 ? '-ml-1.5' : ''}`}
            >
              {String.fromCharCode(65 + ((card.id.charCodeAt(i) + i) % 26))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-gray-400">
          <span className="flex items-center gap-1 text-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            {commentCount}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {taskCount}
          </span>
        </div>
      </div>
    </div>
  )
}
