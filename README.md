# SubMind

SubMind is a privacy-first subscription management app that helps users track recurring charges,
upcoming renewals, and subscription spending without connecting a bank account.

## Current milestones

### Milestone 1: Project architecture and repository setup

This milestone establishes the production foundation before feature work:

- npm workspaces monorepo with `frontend` and `backend` packages.
- Next.js + React + Tailwind CSS frontend shell.
- Express + Prisma backend using a Controller -> Service -> Repository architecture.
- PostgreSQL relational schema for users, subscriptions, Gmail scans, OAuth accounts, detected
  subscriptions, reminders, and notifications.
- Shared developer tooling for linting, formatting, tests, and git hooks.

### Milestone 2: Authentication foundation

This milestone adds the first real app workflow:

- Google OAuth start and callback API routes.
- OAuth state cookie for CSRF protection.
- User upsert and OAuth account persistence.
- JWT-backed HttpOnly access and refresh cookies.
- Current-user, refresh, and logout endpoints.
- React Query current-user loading.
- Protected dashboard and add-subscription pages.

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
client UI state, and a small SaaS dashboard shell. Protected pages check the backend session through
React Query and redirect unauthenticated users to `/login`.

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

Open the browser preview:

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:4000/api/health`

Google OAuth local setup:

1. Create a Google OAuth client in Google Cloud Console.
2. Add `http://localhost:4000/api/auth/google/callback` as an authorized redirect URI.
3. Set these values in `backend/.env`:

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback
JWT_ACCESS_SECRET=replace-with-at-least-32-random-characters
JWT_REFRESH_SECRET=replace-with-at-least-32-random-characters
```

Without those values, the login page still renders but Google login will fail safely with a
configuration error.

Run quality checks:

```bash
npm run lint
npm run test
npm run build
```

## Remaining major steps

1. Manual subscription CRUD UI and API completion.
2. Spending calculations and category analytics.
3. Gmail scan job creation and email fetching.
4. Subscription detection engine and confidence scoring.
5. User confirmation flow for detected subscriptions.
6. Reminder scheduling and email notifications.
7. Telegram bot integration.
