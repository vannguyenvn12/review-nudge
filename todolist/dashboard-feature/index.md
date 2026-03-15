# Dashboard Feature — MVP Todolist

> Track implementation progress for the Review Nudge MVP dashboard.
> Mark each phase `✅ Done` after completing and verifying all tasks.

## Stack Context

- Next.js 15 App Router · TypeScript 5 strict · Tailwind v4 · Supabase · Resend
- Server Components by default · `"use client"` only for interactive forms
- React 19: `useActionState` + `useFormStatus` for forms
- File limit: 200 lines · kebab-case filenames · PascalCase component names

## Already Built (Do Not Rebuild)

- `lib/supabase/client.ts` · `lib/supabase/server.ts` · `lib/supabase/middleware.ts`
- `lib/types/database.ts` (all 4 tables typed)
- `lib/resend/client.ts` · `lib/resend/send-review-request.ts` · `lib/resend/review-request-email.tsx`
- Auth flows: `app/auth/login/` · `app/auth/signup/` · `app/auth/callback/`
- Middleware: session refresh + route protection

## Phases

| #   | Phase                                                 | Status     |
| --- | ----------------------------------------------------- | ---------- |
| 1   | [Layout + Shell Pages](./phase-1-layout-shell.md)     | ✅ Done    |
| 2   | [Shared Components](./phase-2-shared-components.md)   | ✅ Done    |
| 3   | [Overview Page](./phase-3-overview-page.md)           | ✅ Done    |
| 4   | [Customers Page](./phase-4-customers-page.md)         | ✅ Done    |
| 5   | [Jobs Page](./phase-5-jobs-page.md)                   | ✅ Done    |
| 6   | [Reviews Page](./phase-6-reviews-page.md)             | ✅ Done    |
| 7   | [Settings Page](./phase-7-settings-page.md)           | ✅ Done    |
| 8   | [Cron API Route](./phase-8-cron-api-route.md)         | ✅ Done    |
| 9   | [External Cron Config (cron-job.org)](./phase-9-vercel-cron-config.md) | ⬜ Pending |

## Completion Checklist

- [ ] `npm run build` — zero TypeScript errors
- [ ] All 5 dashboard routes render without errors
- [ ] Add customer → appears in list
- [ ] Log job → `review_requests` row created with correct `scheduled_at`
- [ ] `/api/send-pending-reviews` returns `{ processed, failed }` with valid auth
- [ ] Settings persist on reload; warning shows when `google_review_url` is empty
