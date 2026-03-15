# Phase 9 — Vercel Cron Config

**Status:** ⬜ Pending
**Depends on:** Phase 8 (API route must exist)

---

## Goal
Configure Vercel to call `/api/send-pending-reviews` every 15 minutes automatically in production.

---

## Files to Create

| File | Description |
|------|-------------|
| `vercel.json` | Cron schedule config (project root) |

---

## Implementation Details

### `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/send-pending-reviews",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

### How Vercel Cron Auth Works
- Vercel **automatically injects** `Authorization: Bearer <CRON_SECRET>` on production cron calls
- Set `CRON_SECRET` environment variable in Vercel project settings
- Locally, you must pass the header manually for testing

### Environment Variable Setup
Add to `.env.local` (for local testing only):
```env
CRON_SECRET=your-random-secret-here
```
Add to Vercel dashboard: **Settings → Environment Variables → `CRON_SECRET`**

---

## Tasks
- [ ] Create `vercel.json` at project root
- [ ] Add `CRON_SECRET` to `.env.local`
- [ ] Add `CRON_SECRET` to Vercel environment variables (production)
- [ ] Deploy to Vercel and verify cron appears in **Vercel → Project → Cron Jobs** tab
- [ ] Verify cron fires correctly (check Vercel logs after 15 min)

---

## Notes
- Vercel Hobby plan: cron minimum interval is 1 day — upgrade to Pro for `*/15 * * * *`
- For local development testing, trigger the route manually with curl
- `schedule` format: standard 5-field cron in UTC

---

## Success Criteria
- `vercel.json` committed to repo
- Cron job visible in Vercel dashboard after deployment
- `CRON_SECRET` set in Vercel env vars (never committed to repo)
- Cron successfully calls the route and processes pending emails in production
