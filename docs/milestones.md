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
- [x] Persist normalized detections for review.

## Phase 4: Smart detection

- [x] Sender and domain parsing.
- [x] Subject and body keyword matching.
- [x] Price extraction.
- [x] Billing cycle inference.
- [x] Renewal prediction.
- [x] Confidence scoring.
- [x] User confirmation flow.
- [ ] Inline edit-before-confirm for incomplete detections.
- [ ] Provider pattern admin/config surface.

## Phase 5: Reminders and notifications

- [x] Reminder settings.
- [x] In-app notification history.
- [x] Renewal reminder planning.
- [x] Cron-backed reminder job.
- [x] Email notification integration.
- [x] Telegram bot integration.
- [ ] Dedicated worker deployment for production-scale reminders.
