# Milestones

## Phase 1: Foundation

Current milestone:

- [x] Monorepo setup
- [x] Frontend setup
- [x] Backend setup
- [x] Prisma schema
- [x] Dashboard shell
- [x] Google OAuth authentication foundation
- [x] Protected frontend routes
- [ ] Authenticated route middleware hardening

## Phase 2: Manual subscriptions

- [x] CRUD subscriptions.
- [x] Category management.
- [x] Monthly and yearly spending calculations.
- [x] Upcoming renewal tracking.
- [ ] Rich empty states and onboarding tips.
- [ ] Server-side pagination for large subscription lists.

## Phase 3: Gmail integration

- [x] Google OAuth scopes for Gmail.
- [x] Gmail message query and fetching.
- [x] Email scan records.
- [x] User-triggered import page.
- [ ] Background worker queue for long scans.
- [ ] Persist normalized email facts for detection review.

## Phase 4: Smart detection

- Sender and domain parsing.
- Subject and body keyword matching.
- Price extraction.
- Billing cycle inference.
- Renewal prediction.
- Confidence scoring.
- User confirmation flow.
