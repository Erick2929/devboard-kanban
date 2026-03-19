# DevBoard — Achievements

## Phase 0 — Project Bootstrap
- [x] git init
- [x] Vite + React + TypeScript scaffold
- [x] Dependencies installed (dnd-kit, supabase, shadcn, tailwind)
- [x] shadcn initialized with base components
- [x] vite.config.ts with @/ alias
- [x] tsconfig with paths
- [x] .env.example created
- [ ] GitHub repo created + first commit

## Phase 1 — Supabase & Types
- [ ] supabase init
- [ ] Migration 001_initial_schema.sql
- [ ] src/lib/supabase.ts
- [ ] src/types/index.ts

## Phase 2 — Claude Code Setup
- [ ] .claude/CLAUDE.md
- [ ] .claude/hooks/post_edit.json.disabled
- [ ] .claude/skills/component.md
- [ ] .claude/mcp.json

## Phase 3 — Core Components
- [ ] AppHeader
- [ ] BoardCard + test
- [ ] KanbanColumn + test
- [ ] KanbanCard + test
- [ ] src/components/index.ts

## Phase 4 — Hooks
- [ ] useBoards.ts
- [ ] useColumns.ts
- [ ] useCards.ts (WITH intentional bug)

## Phase 5 — Pages
- [ ] LoginPage.tsx (with data-testid)
- [ ] BoardsPage.tsx (with data-testid)
- [ ] BoardDetailPage.tsx

## Phase 6 — App Routing
- [ ] App.tsx with routes and auth guard
- [ ] main.tsx

## Phase 7 — Drag & Drop
- [ ] DndContext in BoardDetailPage
- [ ] KanbanCard draggable
- [ ] KanbanColumn droppable
- [ ] onDragEnd → handleCardDrop

## Phase 8 — E2E Tests
- [ ] playwright.config.ts
- [ ] e2e/kanban.spec.ts (3 tests)
- [ ] data-testid verified in components

## Phase 9 — Demo Setup
- [ ] supabase start + db push
- [ ] Demo user created
- [ ] Seed data inserted
- [ ] GitHub issue created (bug + demo labels)
- [ ] GitHub token in mcp.json
- [ ] playwright install chromium
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
