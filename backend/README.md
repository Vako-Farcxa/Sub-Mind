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
