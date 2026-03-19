import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, DragResult } from '@/types'

function moveCard(cards: Card[], result: DragResult): Card[] {
  return cards.map((card) => {
    if (card.id === result.cardId) {
      return { ...card, column_id: result.destinationColumnId, position: result.newPosition }
    }
    return card
  })
}

export function useCards(columnIds: string[]) {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = async () => {
    if (columnIds.length === 0) return
    setLoading(true)
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .in('column_id', columnIds)
      .order('position', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setCards(data || [])
    }
    setLoading(false)
  }

  const createCard = async (columnId: string, title: string) => {
    const columnCards = cards.filter((c) => c.column_id === columnId)
    const position = columnCards.length

    const { data, error } = await supabase
      .from('cards')
      .insert({ title, column_id: columnId, position, color: '#ffffff' })
      .select()
      .single()

    if (!error && data) {
      setCards((prev) => [...prev, data])
    }
    return { data, error }
  }

  // ❌ BUG: only updates local state, does NOT persist to Supabase
  const handleCardDrop = (result: DragResult) => {
    setCards((prev) => moveCard(prev, result))
    // missing: await supabase.from('cards').update({ column_id: result.destinationColumnId, position: result.newPosition }).eq('id', result.cardId)
  }

  useEffect(() => {
    fetchCards()
  }, [columnIds.join(',')])

  return { cards, loading, error, createCard, handleCardDrop, refetch: fetchCards }
}
