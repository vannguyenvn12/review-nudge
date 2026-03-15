# Phase 9 — External Cron Config (cron-job.org)

**Status:** ⬜ Pending
**Depends on:** Phase 8 (API route must exist)

---

## Goal

Configure [cron-job.org](https://cron-job.org) (free) to call `/api/send-pending-reviews` every 15 minutes in production. Replaces Vercel Cron (Hobby plan limited to 1× per day).

---

## Files to Create / Modify

| File | Description                                                  |
| ---- | ------------------------------------------------------------ |
| None | No code changes needed — Phase 8 route is already compatible |

---

## Setup Steps (cron-job.org Dashboard)

1. Sign up / log in at **https://cron-job.org**
2. Click **Create cronjob**
3. Fill in:
   | Field | Value |
   |-------|-------|
   | Title | `Review Nudge — Send Pending Reviews` |
   | URL | `https://<your-vercel-domain>/api/send-pending-reviews` |
   | Schedule | Every **15 minutes** (`*/15 * * * *`) |
   | Request method | `GET` |
4. Under **Advanced → Headers**, add:
   ```
   Authorization: Bearer <your-CRON_SECRET-value>
   ```
5. Save → **Enable**

---

## Environment Variable Setup

`CRON_SECRET` is already in `.env.local` for local testing.

Add to **Vercel Dashboard → Settings → Environment Variables**:

```
CRON_SECRET=<same value as .env.local>
```

> ⚠️ Never commit `CRON_SECRET` to the repo.

---

## Local Testing

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/send-pending-reviews
# Expected: { "processed": N, "failed": M }
```

---

## Tasks

- [ ] Deploy app to Vercel and note the production URL
- [ ] Add `CRON_SECRET` to Vercel environment variables
- [ ] Create cron job on cron-job.org with correct URL + Authorization header
- [ ] Set schedule to `*/15 * * * *`
- [ ] Trigger manually from cron-job.org dashboard and verify `{ processed, failed }` response
- [ ] Check execution history in cron-job.org after first automatic fire

---

## Why cron-job.org over Vercel Cron

|              | Vercel Cron (Hobby)          | cron-job.org (Free)    |
| ------------ | ---------------------------- | ---------------------- |
| Min interval | 1× per day                   | 1× per minute          |
| Config       | `vercel.json` in repo        | External dashboard     |
| Auth         | Auto-injected by Vercel      | Manual header required |
| Cost         | Pro plan required for `*/15` | Free                   |

---

## Success Criteria

- Cron job active on cron-job.org with correct URL and `Authorization` header
- `CRON_SECRET` set in Vercel env vars (not committed)
- Manual trigger returns `{ processed: N, failed: M }`
- Automatic fires visible in cron-job.org execution history
