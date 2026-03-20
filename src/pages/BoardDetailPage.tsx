import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useColumns } from "@/hooks/useColumns";
import { useCards } from "@/hooks/useCards";
import { KanbanColumn } from "@/components/KanbanColumn";
import { AppHeader } from "@/components/AppHeader";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import type { DragResult } from "@/types";

export function BoardDetailPage() {
  const { id: boardId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { columns, loading: columnsLoading } = useColumns(boardId);
  const columnIds = columns.map((c) => c.id);
  const { cards, handleCardDrop } = useCards(columnIds);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const destinationColumnId = over.id as string;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.column_id === destinationColumnId) return;

    const destinationCards = cards.filter(
      (c) => c.column_id === destinationColumnId,
    );

    const result: DragResult = {
      cardId,
      sourceColumnId: card.column_id,
      destinationColumnId,
      newPosition: destinationCards.length,
    };

    handleCardDrop(result);
  };

  if (columnsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader onLogout={handleLogout} />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={handleLogout} />
      <main className="px-6 py-8">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            data-testid="kanban-board"
          >
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={cards.filter((c) => c.column_id === column.id)}
              />
            ))}
          </div>
        </DndContext>
      </main>
    </div>
  );
}
