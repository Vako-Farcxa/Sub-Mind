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

The first milestone includes the landing page, login shell, dashboard shell, React Query provider,
and Zustand UI store. API-connected features are added in later milestones.
