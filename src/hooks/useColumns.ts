import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Column } from '@/types'

export function useColumns(boardId: string | undefined) {
  const [columns, setColumns] = useState<Column[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchColumns = async () => {
    if (!boardId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', boardId)
      .order('position', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setColumns(data || [])
    }
    setLoading(false)
  }

  const createColumn = async (name: string) => {
    if (!boardId) return
    const position = columns.length

    const { data, error } = await supabase
      .from('columns')
      .insert({ name, board_id: boardId, position })
      .select()
      .single()

    if (!error && data) {
      setColumns((prev) => [...prev, data])
    }
    return { data, error }
  }

  useEffect(() => {
    fetchColumns()
  }, [boardId])

  const deleteColumn = async (id: string) => {
    const { error } = await supabase.from('columns').delete().eq('id', id)
    if (!error) {
      setColumns((prev) => prev.filter((c) => c.id !== id))
    }
    return { error }
  }

  return { columns, loading, error, createColumn, deleteColumn, refetch: fetchColumns }
}
