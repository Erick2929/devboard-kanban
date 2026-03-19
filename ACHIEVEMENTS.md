# DevBoard — Achievements

## Phase 0 — Project Bootstrap
- [x] git init
- [x] Vite + React + TypeScript scaffold
- [x] Dependencies installed (dnd-kit, supabase, shadcn, tailwind)
- [x] shadcn initialized with base components
- [x] vite.config.ts with @/ alias
- [x] tsconfig with paths
- [x] .env.example created
- [x] GitHub repo created + first commit

## Phase 1 — Supabase & Types
- [x] supabase init
- [x] Migration 001_initial_schema.sql
- [x] src/lib/supabase.ts
- [x] src/types/index.ts

## Phase 2 — Claude Code Setup
- [x] .claude/CLAUDE.md
- [x] .claude/hooks/post_edit.json.disabled
- [x] .claude/skills/component.md
- [x] .claude/mcp.json

## Phase 3 — Core Components
- [x] AppHeader
- [x] BoardCard + test
- [x] KanbanColumn + test
- [x] KanbanCard + test
- [x] src/components/index.ts

## Phase 4 — Hooks
- [x] useBoards.ts
- [x] useColumns.ts
- [x] useCards.ts (WITH intentional bug)

## Phase 5 — Pages
- [x] LoginPage.tsx (with data-testid)
- [x] BoardsPage.tsx (with data-testid)
- [x] BoardDetailPage.tsx

## Phase 6 — App Routing
- [x] App.tsx with routes and auth guard
- [x] main.tsx

## Phase 7 — Drag & Drop
- [x] DndContext in BoardDetailPage
- [x] KanbanCard draggable
- [x] KanbanColumn droppable
- [x] onDragEnd → handleCardDrop

## Phase 8 — E2E Tests
- [x] playwright.config.ts
- [x] e2e/kanban.spec.ts (3 tests)
- [x] data-testid verified in components

## Phase 9 — Demo Setup
- [x] supabase start + db push
- [x] Demo user created
- [x] Seed data inserted
- [x] GitHub issue created (bug + demo labels)
- [ ] GitHub token in mcp.json
- [x] playwright install chromium
- [ ] Final push to GitHub

## Phase 10 — Final Verification
- [ ] npm run dev ✓
- [ ] Login works ✓
- [ ] Boards with seed data ✓
- [ ] Drag & drop visual ✓
- [ ] npm run test ✓ (unit tests pass)
- [ ] npm run e2e → 2 pass, 1 fails (bug confirmed) ✓

## Phase 11 — Post-Demo Cleanup
- [ ] Context MD file deleted
- [ ] mcp.json token cleared
- [ ] Seed data removed from DB
- [ ] README.md updated (no event references)
- [ ] Final commit pushed
