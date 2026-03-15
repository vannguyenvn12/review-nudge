# Scout Report: Review Request Tracking System

**Date:** 2026-03-15 | **Time:** 19:33  
**Scope:** How review_requests table tracks status + existing webhooks/callbacks + click-tracking implementation

---

## 1. Review Request Status Tracking

### Database Schema (schema.sql, lines 39-45)
```sql
create table if not exists public.review_requests (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  scheduled_at timestamptz,
  sent_at timestamptz,
  status text not null check (status in ('pending', 'sent', 'failed', 'clicked', 'reviewed'))
);
```

**Status Lifecycle:**
- `pending` → Job created, email scheduled but not sent
- `sent` → Email successfully dispatched via Resend
- `failed` → Email send attempt failed (marked in catch block, no retry logic)
- `clicked` → **PLACEHOLDER** — Email link clicked (no implementation yet)
- `reviewed` → **PLACEHOLDER** — Customer left Google review (no implementation yet)

**Timestamps:**
- `scheduled_at` → When the email should be sent (job.completed_at + profile.delay_hours)
- `sent_at` → When Resend confirmed send (populated on success)

### TypeScript Types (lib/types/database.ts, lines 41-54)
```typescript
export type ReviewRequestStatus =
  | "pending"
  | "sent"
  | "failed"
  | "clicked"
  | "reviewed";

export interface ReviewRequest {
  id: string;
  job_id: string;
  scheduled_at: string | null;
  sent_at: string | null;
  status: ReviewRequestStatus;
}
```

---

## 2. Current API Routes

### `/api/send-pending-reviews` (GET)
**File:** `app/api/send-pending-reviews/route.ts`

**Purpose:** Cron endpoint called by Vercel Cron every 15 minutes (per vercel.json config).

**Flow:**
1. Validates `Authorization: Bearer ${CRON_SECRET}` header
2. Queries `review_requests` where `status='pending'` AND `scheduled_at <= now()`
3. For each due request:
   - Fetches nested job data, customer info, and profile (Google review URL)
   - Calls `sendReviewRequest()` to dispatch via Resend
   - On success: updates `review_requests.status='sent'` + `sent_at=now()` AND `jobs.status='review_sent'`
   - On error: updates `review_requests.status='failed'` (no retry, no exponential backoff)
4. Returns `{ processed: number, failed: number }`

**Key Code Snippet (lines 101-111):**
```typescript
// Mark review_request as sent
await supabase
  .from('review_requests')
  .update({ status: 'sent' as const, sent_at: new Date().toISOString() })
  .eq('id', rr.id);

// Update job status
await supabase
  .from('jobs')
  .update({ status: 'review_sent' as const })
  .eq('id', job.id);
```

### `/auth/callback` (GET)
**File:** `app/auth/callback/route.ts`

**Purpose:** Supabase OAuth/email confirmation callback.

**Flow:**
1. Exchanges one-time code for session (via `exchangeCodeForSession()`)
2. Safety-net: upserts a profile row if one doesn't exist
3. Redirects to dashboard

**Note:** Not relevant to review request tracking — authentication only.

---

## 3. Click/Review Tracking Implementation Status

### Email Template (lib/resend/review-request-email.tsx)
**Current:** Two direct links to `googleReviewUrl`:
- CTA button (lines 92-107): `<a href={googleReviewUrl}>`
- Fallback link (lines 122-127): `<a href={googleReviewUrl}>`

**Gap:** Links point directly to Google review form — no tracking pixel, no redirects, no click detection.

### Email Sending (lib/resend/send-review-request.ts)
**Resend Feature:** Uses `tags` metadata for tracking (lines 61-64):
```typescript
tags: [
  { name: 'type', value: 'review-request' },
  { name: 'review_request_id', value: reviewRequestId },
],
```

**Issue:** Tags track email ID in Resend's system, but Resend **does not natively report clicks back to app** without:
- Webhook configuration (server-side endpoint to receive Resend click events)
- Click tracking enabled on the email send call
- Query parameter appended to links (for DIY tracking)

### Status in Code
- Dashboard (`app/dashboard/page.tsx`): Displays "Clicked" metric (lines 28-30), derived from review_requests with status in `['clicked', 'reviewed']`
- Status badge (`app/dashboard/components/status-badge.tsx`): UI for "clicked" state exists
- **BUT:** No code currently updates `review_requests.status` from `sent` → `clicked`

---

## 4. Missing Webhook / Callback Infrastructure

### Resend Webhooks
Resend v6+ supports webhooks for events: `email.sent`, `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, etc.

**Current:** No webhook route found in codebase. Need:
```
/api/webhooks/resend/route.ts  (not yet implemented)
```

### Google Review Detection
**Current:** No mechanism to detect when a customer actually leaves a review on Google.

**Options:**
1. **Query Google API:** Periodically check Google Business Profile for new reviews (requires auth)
2. **Manual marking:** User clicks "Mark reviewed" in dashboard
3. **Email follow-up:** Send a second email asking for confirmation

---

## 5. Database Indexes & RLS

**Relevant Indexes:**
- `review_requests_job_id_idx` (schema.sql, line 60): Enables fast lookups by job_id

**RLS Policies:**
- `review_requests_select_own`, `review_requests_update_own`: Ownership enforced through jobs.user_id
  - Allows updates to status/timestamps by job owner only
  - Suitable for user dashboard updates (manual marking) or internal admin updates

---

## 6. Resend Version & Capabilities

**Installed:** `resend: ^6.9.3` (package.json, line 19)

**Resend v6+ Features:**
- Idempotency keys: `{ idempotencyKey: 'review-request/{id}' }` (already used)
- Email tags: ✅ Used for metadata
- Click tracking: ⚠️ Not yet enabled
- Webhook events: ⚠️ No endpoint in app

---

## Unresolved Questions

1. **Click Tracking Approach:** Should we use Resend's webhook system, append UTM/tracking params, or use a tracking pixel?
2. **Google Review Detection:** How will the app know when a customer actually leaves a Google review?
3. **Failure Handling:** Should failed emails have a retry mechanism, or is marking `status='failed'` final?
4. **User Feedback:** Should dashboard show "Pending" requests still waiting to send?
5. **Idempotency Window:** Is Resend's 24-hour idempotency window acceptable, or do we need shorter deduplication?

