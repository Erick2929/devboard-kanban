export interface Board {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface Column {
  id: string
  board_id: string
  name: string
  position: number
  created_at: string
}

export interface Card {
  id: string
  column_id: string
  title: string
  description?: string
  color: string
  position: number
  created_at: string
}

export interface DragResult {
  cardId: string
  sourceColumnId: string
  destinationColumnId: string
  newPosition: number
}
