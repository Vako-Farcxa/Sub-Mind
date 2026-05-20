# Architecture notes

## What we are building

SubMind is a subscription management web app. Users will add subscriptions manually, connect Gmail
through Google OAuth, and let the system detect recurring services from receipts, invoices, and
renewal emails.

## Why the first milestone is foundation-only

Subscription detection touches authentication, third-party OAuth, Gmail permissions, background
jobs, persistence, and user confirmation flows. Building those pieces before the repository has a
stable shape creates tight coupling. This milestone establishes the seams first so later features can
be added incrementally.

## Backend request flow

```txt
HTTP request
  -> route
  -> validation middleware
  -> controller
  -> service
  -> repository
  -> Prisma/PostgreSQL
```

- **Routes** map URLs and middleware.
- **Validators** parse and validate user input with Zod.
- **Controllers** handle HTTP concerns only.
- **Services** contain business logic and orchestration.
- **Repositories** contain database access.

## Frontend state strategy

- **React Query** is for server state such as the current user, subscriptions, scans, and analytics.
- **Zustand** is for local UI state such as sidebar state, filters, and temporary preferences.
- **Next.js App Router** keeps pages and layouts colocated by route.

## Authentication flow

```txt
Frontend /login
  -> GET /api/auth/google
  -> Google consent screen
  -> GET /api/auth/google/callback
  -> user + OAuthAccount upsert
  -> HttpOnly access/refresh cookies
  -> redirect to /dashboard
  -> React Query loads /api/auth/me
```

The backend stores OAuth provider data separately from the user account. That separation matters
because a user can later connect additional providers or rotate Google tokens without changing the
core user identity.

## Production concerns already represented

- Helmet security headers.
- Express rate limiting.
- Zod validation.
- HttpOnly JWT cookie auth.
- OAuth state validation for the Google callback.
- Centralized error handling.
- Environment validation.
- Prisma relational schema with indexes and cascade rules.

## Detection engine boundary

The Gmail detection engine lives under `backend/src/services` and emits `DetectedSubscription`
records instead of creating real subscriptions directly. This is intentional: email parsing is
probabilistic, so the system must ask the user to confirm a detection before it affects spending
analytics or renewal reminders.

## Gmail scan flow

```txt
Protected Gmail import page
  -> React Query mutation
  -> POST /api/email-scans
  -> email scan service
  -> Google OAuth account lookup
  -> Gmail API metadata search
  -> EmailScan status/count persistence
  -> detection engine
  -> DetectedSubscription persistence
  -> message previews + detections returned to UI
```

The Gmail import returns message previews but does not persist raw email content. It only persists
normalized detection facts such as sender, subject, provider, price, billing cycle, predicted
renewal date, and confidence score.

## Detection confirmation flow

```txt
Protected detection review page
  -> GET /api/detected-subscriptions
  -> user confirms a candidate
  -> POST /api/detected-subscriptions/:id/confirm
  -> create Subscription with source=gmail
  -> mark DetectedSubscription.confirmedAt
```

Dismissed detections remain auditable through their `dismissedAt` timestamp and are excluded from
the default pending review queue.

## Manual subscription flow

```txt
Protected React page
  -> React Query hook
  -> Express subscription route
  -> Zod validator
  -> subscription controller
  -> subscription service
  -> subscription repository
  -> Prisma Subscription model
```

Dashboard analytics intentionally reuse the subscription service instead of calculating totals in
the browser. This keeps billing-cycle rules consistent across every client and makes the calculations
easy to test without rendering UI.

## Reminder and notification flow

```txt
Cron reminder job or manual settings action
  -> notification service
  -> upcoming active/trialing subscription lookup
  -> reminder planner
  -> idempotent Notification upsert
  -> due notification delivery
  -> IN_APP, EMAIL, or TELEGRAM sender
```

Reminder creation and delivery are separate steps. Creation is idempotent per user, subscription,
channel, and scheduled time so repeated cron runs do not spam duplicate reminders. External delivery
is only attempted for configured channels; failures are stored on the notification record for user
visibility.
