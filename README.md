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

### Milestone 3: Manual subscriptions

This milestone turns the shell into the first usable product slice:

- Subscription list, add, edit, and delete screens.
- React Query hooks for subscription server state.
- Dashboard summary endpoint and widgets.
- Monthly/yearly spend normalization across weekly, monthly, yearly, and trial cycles.
- Category breakdown and upcoming renewal calculations.

### Milestone 4: Gmail import foundation

This milestone connects the Gmail integration boundary:

- Protected Gmail import page.
- Email scan history records.
- Gmail search query builder for subscription-related messages.
- Gmail message metadata fetching through the connected Google OAuth account.
- Message previews returned to the UI for review.
- Focused tests for Gmail query and metadata parsing helpers.

### Milestone 5: Smart detection and confirmation

This milestone turns Gmail scans into reviewable subscription candidates:

- Known-provider matching for Netflix, Spotify, YouTube Premium, ChatGPT Plus, Adobe, Canva,
  Amazon Prime, Notion, GitHub Copilot, Apple, Google One, and Microsoft 365.
- Sender/domain, subject, snippet, price, billing-cycle, and renewal-date parsing.
- Confidence scoring.
- `DetectedSubscription` persistence with duplicate prevention.
- Protected detection review page.
- Confirm flow that creates a real subscription.
- Dismiss flow for false positives.

### Milestone 6: Reminders, email, and Telegram

This milestone completes the notification loop:

- Reminder settings page.
- In-app notification history.
- Renewal reminder planning for active/trialing subscriptions.
- Idempotent notification creation for upcoming renewals.
- SMTP email delivery.
- Telegram bot delivery.
- Cron-backed reminder job on backend startup.
- Manual reminder run action for development checks.

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
- Protected dashboard: `http://localhost:3000/dashboard`
- Subscription list: `http://localhost:3000/subscriptions`
- Add subscription: `http://localhost:3000/subscriptions/new`
- Gmail import: `http://localhost:3000/gmail-import`
- Detected subscriptions: `http://localhost:3000/detected-subscriptions`
- Settings and reminders: `http://localhost:3000/settings`

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
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=replace-with-smtp-user
SMTP_PASS=replace-with-smtp-password
SMTP_FROM=notifications@example.com
TELEGRAM_BOT_TOKEN=replace-with-telegram-bot-token
```

Without those values, the login page still renders but Google login will fail safely with a
configuration error.

Manual subscription browser check:

1. Sign in through Google so the backend sets auth cookies.
2. Open `/subscriptions/new`.
3. Create a subscription with a provider, amount, billing cycle, and renewal date.
4. Open `/subscriptions` to edit or delete the record.
5. Open `/dashboard` to see monthly spend, yearly projection, upcoming renewals, and category
   breakdown update from the API.

Gmail import browser check:

1. Sign in with Google using a client that includes the Gmail readonly scope.
2. Open `/gmail-import`.
3. Choose how many emails to scan and how far back to search.
4. Start the scan.
5. Confirm a scan history row is created and matching Gmail message previews appear.
6. Open `/detected-subscriptions`.
7. Confirm a valid detection to add it to `/subscriptions`, or dismiss a false positive.

Reminder and notification browser check:

1. Open `/settings`.
2. Configure days-before-renewal, email, and Telegram options.
3. Add a subscription with a renewal date inside the configured reminder window.
4. Click "Run reminders now" in notification history.
5. Confirm in-app notifications appear. Email and Telegram delivery require SMTP and bot
   environment variables.

Run quality checks:

```bash
npm run lint
npm run test
npm run build
```

## Deployment

See [`docs/deployment.md`](docs/deployment.md) for the production setup path:

1. Create Google OAuth credentials.
2. Provision PostgreSQL and the backend on Render.
3. Deploy the frontend on Vercel.
4. Configure production environment variables.
5. Run smoke tests.

## Remaining major steps

The core portfolio app roadmap is implemented. Future hardening should focus on production
deployment configuration, background worker isolation, pagination, richer detection editing, and
provider administration.
