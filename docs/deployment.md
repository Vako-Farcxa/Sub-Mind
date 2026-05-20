# Deployment guide

This repository is now prepared for a common split deployment:

- Backend API: Render Web Service
- Database: Render PostgreSQL
- Frontend: Vercel
- OAuth: Google Cloud Console

The code is deploy-ready, but the live infrastructure and secrets must still be created in your own
accounts.

## 1. Google OAuth

Create an OAuth client in Google Cloud Console.

Authorized JavaScript origins:

```txt
https://your-vercel-app.vercel.app
https://your-custom-domain.com
```

Authorized redirect URI:

```txt
https://your-render-backend.onrender.com/api/auth/google/callback
```

Required scopes:

```txt
openid
email
profile
https://www.googleapis.com/auth/gmail.readonly
```

Save:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 2. Render PostgreSQL and backend

You can use `render.yaml` as a blueprint or create resources manually.

Backend settings:

```txt
Root Directory: .
Build Command: npm ci && npm run build:backend && npm run prisma:migrate:deploy
Start Command: npm run start -w backend
Health Check Path: /api/health
```

Prisma migrations are committed under:

```txt
backend/prisma/migrations/
```

Render runs them during deploy with:

```txt
npm run prisma:migrate:deploy
```

The migrations include a seeded provider catalog (`Provider`, `ProviderAlias`, `ProviderDomain`) used
by the detection engine. Confirmed user detections can add provider aliases/domains over time.

Required backend environment variables:

```txt
NODE_ENV=production
DATABASE_URL=<Render PostgreSQL connection string>
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
JWT_ACCESS_SECRET=<64+ random chars>
JWT_REFRESH_SECRET=<64+ random chars>
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
GOOGLE_CLIENT_ID=<Google OAuth client id>
GOOGLE_CLIENT_SECRET=<Google OAuth client secret>
GOOGLE_REDIRECT_URI=https://your-render-backend.onrender.com/api/auth/google/callback
```

Leave `COOKIE_DOMAIN` empty for default Render/Vercel cross-site auth. Only set it when backend and
frontend share a parent domain, such as `api.example.com` and `app.example.com`, where the cookie
domain can be `.example.com`.

Optional delivery variables:

```txt
REMINDER_JOB_ENABLED=true
REMINDER_JOB_CRON=*/15 * * * *
SMTP_HOST=<smtp host>
SMTP_PORT=587
SMTP_USER=<smtp user>
SMTP_PASS=<smtp password>
SMTP_FROM=notifications@example.com
TELEGRAM_BOT_TOKEN=<bot token>
```

## 3. Vercel frontend

Create a Vercel project with:

```txt
Root Directory: frontend
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: .next
```

Required frontend environment variable:

```txt
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com/api
```

## 4. Smoke tests

Backend:

```txt
https://your-render-backend.onrender.com/api/health
```

Frontend:

```txt
https://your-vercel-app.vercel.app
```

Auth:

1. Open `/login`.
2. Continue with Google.
3. Confirm redirect to `/dashboard`.
4. Open browser devtools and confirm API requests to Render include credentials.

Core flows:

1. Add a manual subscription at `/subscriptions/new`.
2. Run Gmail import at `/gmail-import`.
3. Review detections at `/detected-subscriptions`.
4. Configure reminders at `/settings`.

## Production notes

- Use generated random JWT secrets; never use placeholder values.
- Keep `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` for Vercel-to-Render cookie auth.
- Keep `FRONTEND_URL` and `CORS_ORIGINS` in sync with the exact Vercel/custom domains.
- Run Prisma migrations during backend deploy with `npm run prisma:migrate:deploy`.
- For higher traffic, move reminder jobs from the API process into a dedicated worker service.
