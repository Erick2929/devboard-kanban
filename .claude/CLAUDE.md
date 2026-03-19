# DevBoard — Claude Code Conventions

## Language Convention
All code, comments, commit messages, documentation, and file content must be written in **English**.
This applies to: source files, CLAUDE.md, ACHIEVEMENTS.md, git commits, test descriptions, and inline comments.

## Project Overview
DevBoard is a Kanban board app built with Vite + React + TypeScript + shadcn/ui + Tailwind v4 + dnd-kit + Supabase.

## Stack
- **Frontend:** Vite, React 19, TypeScript
- **UI:** shadcn/ui, Tailwind CSS v4, lucide-react
- **Drag & Drop:** @dnd-kit/core, @dnd-kit/sortable
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Testing:** Vitest (unit), Playwright (e2e)

## Component Conventions
- Each component lives in `src/components/ComponentName/index.tsx`
- Props must be explicitly typed with TypeScript interfaces
- All interactive components must have `data-testid` attributes for Playwright
- Use shadcn/ui components as base when possible
- Co-locate tests: `src/components/ComponentName/__tests__/ComponentName.test.tsx`

## File Structure
```
src/
  components/     # Reusable UI components
  hooks/          # Custom React hooks (Supabase logic)
  lib/            # External client setup (supabase.ts)
  pages/          # Page-level components
  types/          # TypeScript type definitions
  test/           # Test setup files
e2e/              # Playwright end-to-end tests
supabase/         # Supabase config and migrations
.claude/          # Claude Code configuration
```

## Critical: Intentional Bug
`src/hooks/useCards.ts` contains an intentional bug in `handleCardDrop`:
- The function updates local state but does NOT persist to Supabase
- **DO NOT FIX THIS BUG** — it is demonstrated live in Demo 3
- The e2e test `la posición de la card persiste al recargar` MUST fail

## Hook Status
`.claude/hooks/post_edit.json.disabled` — must remain `.disabled` at demo start.
This is enabled live during Demo 1.

## Import Alias
Use `@/` for imports from `src/` (e.g., `import { supabase } from '@/lib/supabase'`)

## Naming Conventions
- Components: PascalCase
- Hooks: camelCase with `use` prefix
- Files: camelCase for hooks/utils, PascalCase for components
- Types: PascalCase interfaces

## Running the Project
```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Production build
npm run test       # Unit tests (Vitest)
npm run e2e        # E2E tests (Playwright)
npx supabase start # Start local Supabase
```
