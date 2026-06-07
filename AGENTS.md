# lab-instrument-frontend

Vue 3 + TypeScript + Vite frontend for a university lab instrument sharing management system (桂林电子科技大学实验室仪器共享管理系统). Three roles: student, teacher, admin.

## Project

- **Stack:** Vue 3 (`<script setup>` SFCs), TypeScript, Vite, Ant Design Vue 4.x, Pinia, Vue Router 5, Axios, dayjs
- **Entry:** `src/main.ts` → `src/App.vue`
- **Backend:** REST API at `http://localhost:8000/api` (JWT auth)
- **Docs:** `设计方案.md` (UI/UX design spec), `API文档-前端.md` (full API reference)

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + build (`vue-tsc -b && vite build`) |
| `npm run preview` | Preview production build |

## Architecture

```
src/
  main.ts          — App bootstrap (createApp, mount)
  App.vue          — Root component
  api/             — Axios HTTP client + typed API modules
    http.ts        — Axios instance (baseURL, interceptors for token/401)
    index.ts       — Re-exports authApi, instrumentApi, reservationApi
    auth.ts        — login, register, logout
    instrument.ts  — CRUD instruments + categories
    reservation.ts — CRUD reservations, approval
  types/
    index.ts       — All TypeScript interfaces (User, Instrument, Reservation, TimeSlot, …)
  stores/          — Pinia stores (empty — to be implemented)
  router/          — Vue Router config (empty — to be implemented)
  views/           — Page components (empty dirs: auth/, instrument/, reservation/, admin/)
  components/      — Reusable components (HelloWorld.vue — scaffold default)
  layouts/         — Layout components (empty)
  assets/          — Static images
  style.css        — Global styles with CSS variables + dark mode
```

## Conventions

- **Vue SFCs**: Use `<script setup lang="ts">` exclusively (Composition API).
- **TypeScript**: Strict mode (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`). Import types with `type` keyword when value-only (`import type { Foo }`).
- **Path alias**: `@/` maps to `src/` (e.g. `import { User } from '@/types'`).
- **API layer**: Each domain exports a const object (e.g. `export const authApi = { … }`) wrapping axios calls. No direct `axios.get` outside `api/`.
- **API error handling**: The `http.ts` interceptor handles 401 (clear token, redirect to `/login`). Components handle other errors locally.
- **State management**: Use Pinia stores in `stores/`. No component-scoped global state.
- **Routing**: Use Vue Router in `router/`. Add route guards for auth + role-based access.
- **UI**: Ant Design Vue components. Follow `设计方案.md` for layout, color, typography.
- **i18n/Language**: All UI text is in Chinese.
- **CSS**: Use CSS variables from `style.css`. Scoped styles in SFCs preferred. Light/dark mode via `prefers-color-scheme`.
- **Dates**: Use `dayjs` library.

## Notes
- 你必须在完成每次最小改动后，立即使用git commit 存档。
<!-- Quick-add space for future context -->
