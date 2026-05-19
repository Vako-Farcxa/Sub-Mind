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

## Planned detection engine boundary

The Gmail detection engine should be introduced under `backend/src/services` and
`backend/src/integrations/gmail` later. It should emit `DetectedSubscription` records rather than
creating real subscriptions directly. Users confirm detections before they become active
subscriptions.
