# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Sub-Mind is a privacy-first subscription tracker (monorepo with npm workspaces). Two services:

| Service                          | Directory   | Port | Command                |
| -------------------------------- | ----------- | ---- | ---------------------- |
| Backend (Express 5 + Prisma 7)   | `backend/`  | 4000 | `npm run dev:backend`  |
| Frontend (Next.js 16 + React 19) | `frontend/` | 3000 | `npm run dev:frontend` |

Both services together: `npm run dev` (uses concurrently).

### Prerequisites

- **PostgreSQL 16** must be running on `localhost:5432` with user `postgres` / password `postgres` and database `submind`.
- **Node.js 22+** (pre-installed).

### Starting PostgreSQL

```sh
sudo pg_ctlcluster 16 main start
```

### Environment configuration

Backend requires `backend/.env` (copy from `backend/.env.example`). JWT secrets must be >= 32 characters. Google OAuth keys are optional — app starts without them.

### Key commands (from workspace root)

| Task                   | Command                              |
| ---------------------- | ------------------------------------ |
| Install deps           | `npm install`                        |
| Lint (both)            | `npm run lint`                       |
| Format check           | `npm run format`                     |
| Tests                  | `npm run test`                       |
| Build frontend         | `npm run build`                      |
| Generate Prisma client | `npm run prisma:generate -w backend` |
| Run migrations         | `npm run prisma:migrate -w backend`  |

### Gotchas

- The Prisma schema uses `@prisma/adapter-pg` (driver adapter pattern). `prisma generate` must be run after installing dependencies for the first time.
- The health test (`backend/tests/health.test.js`) does NOT require a live database — it only tests the Express app without hitting Prisma.
- `DATABASE_URL` is marked optional in the Zod env schema, but the Prisma client will throw at runtime if it's missing and a DB-dependent route is hit.
- Next.js 16 with Turbopack is the default dev mode. No special flags needed.
- The `.husky/pre-commit` hook runs `lint-staged` (Prettier + ESLint on staged files).
