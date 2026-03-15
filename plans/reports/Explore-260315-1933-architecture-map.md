# Architecture Map: Review Request Lifecycle

## Current Flow (Implemented)

```
┌─────────────────────────────────────────────────────────────┐
│ User Creates Job (dashboard or API)                         │
│ - Status: "completed"                                       │
│ - Job linked to Customer and Profile                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Create ReviewRequest (scheduled)                            │
│ - scheduled_at = now() + delay_hours (from profile)         │
│ - status = "pending"                                        │
│ - sent_at = NULL                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Cron: Every 15 minutes       │
        │ GET /api/send-pending-reviews│
        │ (CRON_SECRET auth)           │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Query: review_requests       │
        │ WHERE status='pending'       │
        │   AND scheduled_at <= now()  │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │ For each pending request:    │
        │ 1. Fetch nested data         │
        │ 2. Build email (React)       │
        │ 3. Call Resend API           │
        │ 4. Update status             │
        │                              │
        │ Success:                     │
        │ - review_requests.status =   │
        │   'sent'                     │
        │ - sent_at = now()            │
        │ - jobs.status = 'review_sent'│
        │                              │
        │ Failure:                     │
        │ - review_requests.status =   │
        │   'failed'                   │
        │ - NO RETRY, NO RETRY QUEUE   │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Resend dispatches email      │
        │ - Direct link to Google URL  │
        │ - No tracking pixel          │
        │ - No UTM params              │
        │ - Tags: [type, review_req_id]│
        └──────────────┬───────────────┘
                       │
                       ▼
    ┌──────────────────────────────────┐
    │ Customer receives email          │
    │ and clicks "Leave Review"        │
    │                                  │
    │ PROBLEM: No tracking mechanism   │
    │ - Link goes directly to Google   │
    │ - App never learns click happened│
    │ - review_requests.status remains │
    │   'sent' (never transitions)     │
    └──────────────────────────────────┘
```

---

## Missing Infrastructure (To Be Implemented)

### Option A: Resend Webhooks
```
Resend (backend)
   │
   ├─ email.clicked event
   │
   ▼
POST /api/webhooks/resend
   │
   ├─ Verify signature
   ├─ Extract review_request_id from tags
   ├─ Update review_requests.status = 'clicked'
   │
   ▼
Dashboard: Shows "Clicked" metric ✓
```

### Option B: Tracking Redirect + Query Param
```
Email link (modified):
   href="/api/tracking/review/{reviewRequestId}"
   │
   ├─ Accept click
   ├─ Update review_requests.status = 'clicked'
   ├─ Record timestamp
   │
   ▼
Redirect to google_review_url
```

### Option C: Google Business API Polling
```
Scheduled job (hourly/daily):
   │
   ├─ Authenticate to Google Business API
   ├─ Fetch recent reviews for each business
   ├─ Match customer email/name
   ├─ Update review_requests.status = 'reviewed'
   │
   ▼
Dashboard: Shows "Reviewed" metric ✓
```

---

## File Structure

```
app/
├── api/
│   ├── send-pending-reviews/
│   │   └── route.ts ............................ [IMPLEMENTED]
│   │       - Cron: query pending → send via Resend
│   │       - Update status: pending → sent/failed
│   │
│   ├── webhooks/
│   │   └── resend/ ............................ [NOT STARTED]
│   │       - POST endpoint for Resend events
│   │       - Verify signature
│   │       - Update review_requests.status
│   │
│   └── tracking/
│       └── review/[requestId]/ .............. [NOT STARTED]
│           - Optional redirect tracker
│           - Update status on click
│
├── auth/
│   └── callback/
│       └── route.ts .......................... [IMPLEMENTED]
│           - OAuth/email confirmation only
│
└── dashboard/
    ├── page.tsx ............................. [IMPLEMENTED]
    │   - Shows "Clicked" metric
    │   - Counts from review_requests.status in ['clicked', 'reviewed']
    │
    └── components/
        └── status-badge.tsx ................. [IMPLEMENTED]
            - UI for 'clicked' state

lib/
├── resend/
│   ├── client.ts ............................ [IMPLEMENTED]
│   ├── send-review-request.ts .............. [IMPLEMENTED]
│   │   - Tags: review_request_id
│   │   - Idempotency key for deduplication
│   │   - No click tracking enabled yet
│   │
│   └── review-request-email.tsx ............ [IMPLEMENTED]
│       - Two direct links (no tracking)
│
└── types/
    └── database.ts .......................... [IMPLEMENTED]
        - ReviewRequestStatus type
        - review_requests interface

schema.sql .................................. [IMPLEMENTED]
├── review_requests table
│   - Status constraint: pending|sent|failed|clicked|reviewed
│   - RLS policies: ownership via jobs.user_id
└── Indexes: review_requests_job_id_idx
```

---

## Data Flow: Current vs. Target

### Current (Incomplete)
```
pending → sent → [STUCK] (no click detection)
           ↓
         failed
```

### Target
```
pending → sent → clicked → reviewed ✓
           ↓
         failed (with optional retry)
```

---

## Decision Matrix: Which Approach?

| Approach         | Pros | Cons | Resend Integration |
|-----------------|------|------|-------------------|
| **Webhooks**     | Real-time, passive | Setup Resend webhooks, secret management | Native click events |
| **Redirect**     | Simple, no setup | User sees redirect, slight UX hit | Custom implementation |
| **Google API**   | Authoritative (actual review) | Rate limits, polling lag, auth needed | Orthogonal |
| **Manual Mark**  | Zero infrastructure | Relies on user honesty | Not automated |

**Recommended:** Webhooks (real-time, no UX impact) + Optional redirect fallback for edge cases.

