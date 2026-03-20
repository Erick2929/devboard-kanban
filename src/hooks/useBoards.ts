import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Board } from '@/types'

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBoards = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setBoards(data || [])
    }
    setLoading(false)
  }

  const createBoard = async (name: string, color = '#6366f1') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('boards')
      .insert({ name, color, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setBoards((prev) => [data, ...prev])
    }
    return { data, error }
  }

  const deleteBoard = async (id: string) => {
    const { error } = await supabase.from('boards').delete().eq('id', id)
    if (!error) {
      setBoards((prev) => prev.filter((b) => b.id !== id))
    }
    return { error }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  return { boards, loading, error, createBoard, deleteBoard, refetch: fetchBoards }
}
