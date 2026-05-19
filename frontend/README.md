# SubMind frontend

Next.js App Router frontend for the SubMind subscription management app.

## Scripts

```bash
npm run dev -w frontend
npm run lint -w frontend
npm run build -w frontend
```

## Structure

- `src/app` contains route segments and layouts.
- `src/components` contains reusable UI building blocks.
- `src/lib` contains API clients and shared frontend utilities.
- `src/store` contains Zustand client state.

## Environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to the backend API URL.

```bash
cp frontend/.env.example frontend/.env.local
```

The frontend includes the landing page, login page, protected dashboard shell, subscription CRUD
screens, React Query provider, auth hooks, and Zustand UI store. Visit `/login` to start Google
OAuth once the backend environment is configured.

## Product routes

- `/` landing page
- `/login` Google OAuth entry point
- `/dashboard` protected dashboard with summary widgets
- `/gmail-import` protected Gmail scan page
- `/detected-subscriptions` protected detection review queue
- `/settings` protected reminder, notification, email, and Telegram settings
- `/subscriptions` protected subscription list
- `/subscriptions/new` protected create form
- `/subscriptions/:id/edit` protected edit form
