# Repository Guidelines

## Project Structure & Module Organization
- Frontend (Vite + React + TS): source in `src/` with `components/`, `pages/`, `layouts/`, `services/`, `store/`, `lib/`, and `types/`. Static assets in `public/`. Build output in `dist/`.
- Backend (Express + TS): located in `backend/` with `src/{routes,controllers,models,middleware,utils}`. Also `backend/protected_files/` (uploads) and `backend/logs/`.

## Build, Test, and Development Commands
- Frontend dev: `npm run dev` (launches Vite dev server).
- Frontend build/preview: `npm run build` then `npm run preview`.
- Frontend lint: `npm run lint`.
- Backend dev: `cd backend && npm run dev` (tsx watch).
- Backend build/start: `cd backend && npm run build && npm start`.
- Backend seed: `cd backend && npm run seed`.
- Deploy (Firebase): run `deploy-firebase.bat`/`.ps1` after a fresh frontend build; config in `firebase.json`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces. Prefer TypeScript for new code (`.ts`/`.tsx`).
- Tools: ESLint (`.eslintrc.json`) and Prettier (`.prettierrc`). Keep `npm run lint` clean.
- Components: PascalCase (e.g., `DashboardLayout`, `Button`) in `src/components`. Hooks camelCase prefixed with `use...`.
- State/store: camelCase in `src/store`. Constants UPPER_SNAKE_CASE.
- Tailwind: use utility classes in `className`; compose with `clsx` and `tailwind-merge`.

## Testing Guidelines
- No test runner configured yet. If adding tests:
  - Frontend: Vitest + React Testing Library.
  - Backend: Jest + Supertest.
- Name tests `*.test.ts(x)` beside sources or in `__tests__/`. Aim to cover `services`, `lib/utils`, and API routes.

## Commit & Pull Request Guidelines
- Current history is free‑form. Prefer clear, present‑tense summaries; optionally follow Conventional Commits (e.g., `feat: add patient search`, `fix: update auth flow`).
- PRs: include purpose, linked issues, steps to test, screenshots for UI, and note env/config changes. Update docs (`README.md`, `README_SISTEMA.md`) when relevant.

## Security & Configuration Tips
- Do not commit secrets. Copy `.env.example` to `.env` in root and `backend/` and fill values locally.
- Review CORS, rate limiting, and file handling in the backend. Keep `backend/protected_files/` out of VCS.
- For Firebase deploys, ensure `dist/` is current and rules are audited.

