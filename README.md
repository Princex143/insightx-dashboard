# InsightX Control Tower (Frontend-Only)

Portfolio-grade frontend project that simulates an enterprise analytics SaaS app with no backend dependency.

## Stack
- React + TypeScript + Vite
- React Router for protected app routing
- Zustand for global state and persistence
- TanStack Query for server-state simulation and caching

## Features Implemented
- Mock auth with role switching (`admin` / `viewer`)
- Protected routes and persisted sessions
- KPI dashboard with async loading states
- Drag/reorder dashboard widgets with persistent layout
- Large virtualized events table (6k rows)
- Advanced filters + saved filter views
- CSV export of filtered data
- Command palette (`Ctrl+K`) with quick actions
- Toast notifications and network status indicator
- Global React error boundary fallback screen
- Responsive UI with custom visual style

## Local Run
```bash
npm install
npm run dev
```

Demo credentials:
- `admin@insightx.dev` / `admin123`
- `viewer@insightx.dev` / `viewer123`

## Validation
```bash
npm run lint
npm run build
```

## Resume Bullet (Use This)
Built a frontend-only enterprise analytics dashboard using React, TypeScript, Zustand, and TanStack Query, including protected routing, role-based UI, persistent layout builder, virtualized large-data tables, saved views, command palette shortcuts, and robust UX states (error boundary, offline indicator, toasts).

## Suggested Next Upgrades
1. Add charting library (ECharts/Recharts) with interactive drill-down.
2. Integrate MSW to formalize mocked REST endpoints.
3. Add Vitest + React Testing Library + Playwright suites.
4. Add i18n and accessibility test checks (axe).
5. Deploy with CI previews and add architecture diagram screenshots.
