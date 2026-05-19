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
