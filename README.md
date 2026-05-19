# SubMind

SubMind is a privacy-first subscription management app that helps users track recurring charges,
upcoming renewals, and subscription spending without connecting a bank account.

## Milestone 1: Project architecture and repository setup

This milestone establishes the production foundation before feature work:

- npm workspaces monorepo with `frontend` and `backend` packages.
- Next.js + React + Tailwind CSS frontend shell.
- Express + Prisma backend using a Controller -> Service -> Repository architecture.
- PostgreSQL relational schema for users, subscriptions, Gmail scans, OAuth accounts, detected
  subscriptions, reminders, and notifications.
- Shared developer tooling for linting, formatting, tests, and git hooks.

## Repository structure

```txt
.
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── db/
│       ├── integrations/
│       ├── jobs/
│       ├── middleware/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── validators/
│       ├── app.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── store/
├── docs/
├── package.json
└── package-lock.json
```

## Architecture decisions

### Monorepo with npm workspaces

The frontend and backend are separate deployable apps, but they share root scripts and one lockfile.
This keeps local development simple while preserving clean service boundaries.

### Backend layering

Routes only define HTTP paths and middleware. Controllers translate HTTP requests into service calls.
Services own business rules. Repositories own Prisma persistence. This keeps future Gmail detection,
spending calculations, and reminders testable and maintainable.

### Prisma-first data model

The schema models the core domain up front so later milestones can build against stable entities:

- `User`
- `Subscription`
- `DetectedSubscription`
- `ReminderSettings`
- `Notification`
- `OAuthAccount`
- `EmailScan`

### Frontend foundation

The frontend uses the Next.js App Router, Tailwind CSS, React Query for server state, Zustand for
client UI state, and a small SaaS dashboard shell. The login page is intentionally a placeholder
until the auth milestone connects Google OAuth and HttpOnly cookie sessions.

## Getting started

Install dependencies:

```bash
npm install
```

Copy environment examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Generate Prisma client:

```bash
npm run prisma:generate -w backend
```

Run both apps:

```bash
npm run dev
```

Run quality checks:

```bash
npm run lint
npm run test
npm run build
```

## Next milestone

Phase 1 continues with authentication:

1. Connect Google OAuth consent flow.
2. Store OAuth account records.
3. Issue JWT-backed HttpOnly cookies.
4. Protect dashboard routes.
5. Add authenticated user loading through React Query.
