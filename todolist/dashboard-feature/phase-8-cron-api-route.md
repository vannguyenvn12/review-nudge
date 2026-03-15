# Phase 8 — Cron API Route (`/api/send-pending-reviews`)

**Status:** ✅ Done
**Depends on:** Phase 5 (review_requests must be inserted by logJobAction)

---

## Goal
Build the API route that queries pending review requests and dispatches emails via Resend. Called by Vercel Cron every 15 minutes (Phase 9).

---

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `app/api/send-pending-reviews/route.ts` | API Route (GET) | Cron email dispatch endpoint |

---

## Implementation Details

### Auth Guard
```ts
const authHeader = request.headers.get('authorization')
const cronSecret = process.env.CRON_SECRET
if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Client
Use `createAdminClient()` from `lib/supabase/server.ts` — service role key bypasses RLS (no user session in cron context).

### Query Pending Requests
```ts
const { data: pending } = await supabase
  .from('review_requests')
  .select(`
    id,
    jobs (
      id,
      user_id,
      customers ( name, email ),
      profiles!user_id ( business_name, google_review_url )
    )
  `)
  .eq('status', 'pending')
  .lte('scheduled_at', new Date().toISOString())
```

### Per-Request Processing
```ts
for (const rr of pending) {
  const { google_review_url, business_name } = rr.jobs.profiles

  // Skip if no review URL configured
  if (!google_review_url) {
    console.warn(`Skipping ${rr.id}: no google_review_url`)
    continue
  }

  try {
    // Call existing lib function
    await sendReviewRequest({
      reviewRequestId: rr.id,
      customerName: rr.jobs.customers.name,
      customerEmail: rr.jobs.customers.email,
      businessName: business_name,
      googleReviewUrl: google_review_url,
    })

    // Mark as sent
    await supabase.from('review_requests')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', rr.id)

    // Update job status
    await supabase.from('jobs')
      .update({ status: 'review_sent' })
      .eq('id', rr.jobs.id)

    processed++
  } catch (err) {
    // Mark as failed — don't throw, continue processing others
    await supabase.from('review_requests')
      .update({ status: 'failed' })
      .eq('id', rr.id)
    failed++
  }
}
```

### Response
```ts
return NextResponse.json({ processed, failed })
```

### Reuses
- `lib/resend/send-review-request.ts` — existing `sendReviewRequest()` function
- `lib/supabase/server.ts` — `createAdminClient()`

---

## Environment Variables Required
| Variable | Description |
|----------|-------------|
| `CRON_SECRET` | Random string for auth header validation |
| `SUPABASE_SERVICE_ROLE_KEY` | Already in `.env.local` |
| `RESEND_API_KEY` | Already in `.env.local` |

---

## Tasks
- [x] Create `app/api/send-pending-reviews/route.ts`
- [x] Implement `Bearer CRON_SECRET` auth check (401 if invalid)
- [x] Use `createAdminClient()` (NOT regular createClient)
- [x] Query pending requests with nested joins
- [x] Loop: send email → update `review_requests.status` + `sent_at` → update `jobs.status`
- [x] Handle failures gracefully (set `status = 'failed'`, continue loop)
- [x] Skip requests with no `google_review_url` (log warning)
- [x] Return `{ processed, failed }` JSON
- [x] Add `CRON_SECRET` to `.env.local`
- [ ] Test endpoint manually with `curl -H "Authorization: Bearer <secret>" http://localhost:3000/api/send-pending-reviews`

---

## Success Criteria
- Returns 401 without correct `Authorization` header
- Returns `{ processed: N, failed: M }` with valid auth
- Pending `review_requests` rows update to `sent` after processing
- Corresponding `jobs` rows update to `review_sent`
- Failed emails marked `failed` without crashing the entire batch
- No TypeScript errors
