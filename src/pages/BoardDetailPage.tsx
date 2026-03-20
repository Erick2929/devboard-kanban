import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useColumns } from '@/hooks/useColumns'
import { useCards } from '@/hooks/useCards'
import { KanbanColumn } from '@/components/KanbanColumn'
import { Sidebar } from '@/components/Sidebar'
import { DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { DragResult, Board } from '@/types'
import { Search, LayoutGrid, Filter, ArrowUpDown, Upload, Plus, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const HEADER_AVATARS = [
  'bg-rose-400', 'bg-violet-400', 'bg-blue-400', 'bg-emerald-400', 'bg-amber-400',
]

const VIEW_TABS = ['Grid View', 'List View', 'Column View', 'Row View']

export function BoardDetailPage() {
  const { id: boardId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { columns, loading: columnsLoading } = useColumns(boardId)
  const columnIds = columns.map((c) => c.id)
  const { cards, handleCardDrop } = useCards(columnIds)
  const [board, setBoard] = useState<Board | null>(null)

  useEffect(() => {
    if (!boardId) return
    supabase.from('boards').select('*').eq('id', boardId).single()
      .then(({ data }) => setBoard(data))
  }, [boardId])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const cardId = active.id as string
    const destinationColumnId = over.id as string
    const card = cards.find((c) => c.id === cardId)
    if (!card || card.column_id === destinationColumnId) return

    const destinationCards = cards.filter((c) => c.column_id === destinationColumnId)
    const result: DragResult = {
      cardId,
      sourceColumnId: card.column_id,
      destinationColumnId,
      newPosition: destinationCards.length,
    }
    handleCardDrop(result)
  }

  const boardName = board?.name || 'Board'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 ml-14 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header
          className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0"
          data-testid="app-header"
        >
          <nav className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-600 font-medium">Dashboard</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Project</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-indigo-600 font-medium">{boardName}</span>
          </nav>

          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <Search className="w-4 h-4" />
            </button>
            <div className="flex items-center">
              {HEADER_AVATARS.map((color, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full border-2 border-white ${color} ${i > 0 ? '-ml-1.5' : ''}`}
                />
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
              <Plus className="w-3.5 h-3.5" />
              Invite
            </button>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Project header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 shrink-0" />
              <h1 className="text-xl font-bold text-gray-900">{boardName}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                <LayoutGrid className="w-3.5 h-3.5" />
                Grid View
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort
              </button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {VIEW_TABS.map((view) => (
              <button
                key={view}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  view === 'Column View'
                    ? 'text-indigo-600 bg-indigo-50 font-medium'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban board */}
        <main className="flex-1 px-6 py-6 overflow-x-auto">
          {columnsLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">Loading board...</p>
            </div>
          ) : (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="flex gap-6 pb-4" data-testid="kanban-board">
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    cards={cards.filter((c) => c.column_id === column.id)}
                  />
                ))}
              </div>
            </DndContext>
          )}
        </main>
      </div>
    </div>
  )
}
