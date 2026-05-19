# SubMind backend

Express API for the SubMind subscription management app.

## Scripts

```bash
npm run dev -w backend
npm run lint -w backend
npm run test -w backend
npm run prisma:validate -w backend
npm run prisma:generate -w backend
```

## Layering

```txt
routes -> middleware -> controllers -> services -> repositories -> Prisma
```

- Controllers stay thin and only handle HTTP input/output.
- Services own business logic such as auth, billing calculations, Gmail detection, and reminders.
- Repositories own database calls and keep Prisma out of controllers.

## Environment

Copy `.env.example` to `.env` and set real secrets locally or in the deployment platform.

```bash
cp backend/.env.example backend/.env
```

Never commit real OAuth credentials, JWT secrets, or database URLs.

## Auth endpoints

- `GET /api/auth/google` starts Google OAuth.
- `GET /api/auth/google/callback` exchanges the Google code and sets auth cookies.
- `GET /api/auth/me` returns the current user when an access cookie is valid.
- `POST /api/auth/refresh` rotates access/refresh cookies from a refresh cookie.
- `POST /api/auth/logout` clears auth cookies.

Google OAuth requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`,
`JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`.

## Subscription endpoints

All subscription endpoints require a valid auth cookie or bearer token.

- `GET /api/subscriptions` lists subscriptions.
- `GET /api/subscriptions/summary` returns dashboard spend and renewal summary data.
- `GET /api/subscriptions/:id` returns one subscription.
- `POST /api/subscriptions` creates a manual subscription.
- `PATCH /api/subscriptions/:id` updates a subscription.
- `DELETE /api/subscriptions/:id` deletes a subscription.

## Email scan endpoints

All email scan endpoints require a valid auth cookie or bearer token.

- `GET /api/email-scans` lists recent Gmail scan records.
- `POST /api/email-scans` starts a Gmail metadata scan.
- `GET /api/email-scans/:id` returns one scan record.

`POST /api/email-scans` accepts optional `maxResults` and `newerThanDays` values. Gmail message
previews are returned in the response, while scan status and counts are persisted in `EmailScan`.

## Detected subscription endpoints

All detected subscription endpoints require a valid auth cookie or bearer token.

- `GET /api/detected-subscriptions` lists pending detections by default.
- `POST /api/detected-subscriptions/:id/confirm` creates a real subscription from a detection.
- `POST /api/detected-subscriptions/:id/dismiss` dismisses a false positive.

Confirmation accepts optional override fields such as `amount`, `billingCycle`, `renewalDate`, and
`category` for detections that need user correction before becoming subscriptions.
