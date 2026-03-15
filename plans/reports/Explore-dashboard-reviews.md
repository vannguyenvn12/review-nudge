# Dashboard Reviews Page Exploration Report

**Date:** 2026-03-15  
**Focus:** Understanding `/dashboard/reviews` page implementation & patterns

---

## 1. File Inventory

### Exists
- ✅ `app/dashboard/reviews/page.tsx` — Main reviews page (read-only server component)
- **Missing:** `app/dashboard/reviews/actions.ts` — No server actions for reviews yet

### Related Core Files
- ✅ `lib/types/database.ts` — ReviewRequest & ReviewRequestStatus types
- ✅ `app/dashboard/jobs/actions.ts` — Pattern reference for server actions
- ✅ `app/dashboard/customers/actions.ts` — Pattern reference for CRUD actions
- ✅ `app/dashboard/components/status-badge.tsx` — Shared status rendering
- ✅ `app/dashboard/components/empty-state.tsx` — Empty state UI pattern
- ✅ `app/dashboard/layout.tsx` — Dashboard layout & auth guard
- ✅ `app/dashboard/jobs/page.tsx` — Example of table + form pattern

---

## 2. Reviews Page Summary

**Current State:** Read-only server component displaying review requests in a table.

**Columns:** Customer | Service | Scheduled At | Sent At | Status

**Key Patterns:**
- Server component (no "use client")
- Nested Supabase query: review_requests → jobs → customers
- StatusBadge component for color-coded status display
- Empty state with CTA to log a job
- Sorted by scheduled_at (newest first)
- No interactive elements, no forms, no buttons

**Query Join Path:**
```
review_requests {id, scheduled_at, sent_at, status}
  → jobs {service_type, completed_at}
    → customers {name}
```

---

## 3. ReviewRequest Type Definition

**Type:** `ReviewRequestStatus` (Union)
```
"pending" | "sent" | "failed" | "clicked" | "reviewed"
```

**Type:** `ReviewRequest` (Interface)
```typescript
{
  id: string;
  job_id: string;
  scheduled_at: string | null;    // ISO 8601
  sent_at: string | null;         // ISO 8601
  status: ReviewRequestStatus;
}
```

**Notes:**
- Both timestamps nullable (pending = not sent yet)
- No created_at in DB schema
- Linked 1:1 to jobs (FK)

---

## 4. Server Action Patterns (Reference)

### Jobs Action (logJobAction)
- State type: `{ error: string } | null`
- Returns null on success, error object on failure
- Validates inputs, inserts job, calculates scheduled_at from delay_hours, inserts review_request
- Revalidates with `revalidatePath('/dashboard/jobs')`
- Uses `as any` cast (Supabase postgrest-js constraint workaround)

### Customers Action (createCustomerAction)
- State type: `{ error: string } | null`
- FormData parsing + validation
- Inserts with user context
- Revalidates customers page

### Settings Action (updateSettingsAction)
- State type: `{ success: true } | { error: string } | null`
- Has try/catch wrapper
- Returns `{ success: true }` on success (different pattern)
- Uses `update()` instead of `insert()`

**Pattern Inconsistency:** Settings returns `{ success: true }`, while Jobs/Customers return `null`. Worth standardizing.

---

## 5. UI Component Patterns

### StatusBadge
- Maps status → color (pending=gray, sent=blue, failed=red, clicked=purple, reviewed=green)
- Pill-shaped (rounded-full, px-2 py-0.5, text-xs)
- Works for both JobStatus and ReviewRequestStatus

### EmptyState
- Centered flex column with message text
- Optional CTA link (dark button)
- Used when table has no rows

### Table Pattern
- Consistent across Jobs, Customers, Reviews pages
- Header: uppercase, tracking-wide, bg-gray-50
- Rows: divide-y, hover:bg-gray-50
- Null values → "—"
- Dates → `.toLocaleString()`

---

## 6. Data Flow: Job → Review Request

1. User logs job via `logJobAction` → inserts into jobs table
2. Action fetches user profile for delay_hours
3. Calculates scheduled_at = completed_at + (delay_hours * 3600 * 1000)
4. Inserts review_requests row with status='pending'
5. Reviews page queries and displays all requests

**Current Gap:** No automation visible in dashboard. Assumes Supabase Edge Function or cron job handles:
- Sending email at scheduled_at time (via Resend)
- Updating status from "pending" → "sent"
- Tracking clicks/reviews via `/api/track/[reviewRequestId]/route.ts`

---

## 7. Missing Implementations

### In app/dashboard/reviews/
- ❌ actions.ts (no server actions for review management)
- ❌ Form/buttons (read-only view only)
- ❌ Custom components (log-job-form pattern not applied here)

### Interactive Features Not Yet Built
- No "retry failed" button
- No "send now" button
- No filters/sorting UI
- No pagination (may be needed for many records)
- No row click/detail view

### API Routes
- ✅ `/api/send-pending-reviews/route.ts` exists (sending mechanism)
- ✅ `/api/track/[reviewRequestId]/route.ts` exists (click tracking)
- No specific review management endpoints visible

---

## 8. Code Quality Observations

**Strengths:**
- Consistent component patterns across dashboard pages
- Proper TypeScript types (no `any` in component code)
- Tailwind semantic color usage (no hardcoded hex)
- Clean separation: server components for data, server actions for mutations

**Tech Debt:**
- `as any` casting in actions (Supabase library constraint)
- State pattern inconsistency between actions
- No error boundaries or error logging

---

## 9. Tailwind Styling Summary

**Colors used:** gray-900, 50, 200, 500, 600, 100, 800 (for badges)
**Spacing:** px-4 py-3 (table cells), px-2 py-0.5 (badges)
**Text:** text-sm (body), text-xs (headers, badges), text-2xl (headings)
**Borders:** rounded-lg (tables), rounded-full (badges)
**Effects:** hover:bg-gray-50, divide-y, shadow-sm

---

## 10. Unresolved Questions

1. **Email Sending Trigger:** How/where is Resend API called? Edge Function? Cron?
2. **Click Tracking:** How does `/api/track/` update the status to "clicked"?
3. **Status Update Flow:** Who updates "pending" → "sent" → "reviewed"?
4. **State Pattern Standardization:** Why different return types across actions?
5. **Pagination Need:** How many reviews before pagination is needed?
6. **Manual Actions:** Are retry/send-now buttons planned?
7. **Review Details Page:** Should users see email content, retry count, etc.?

---

## Summary

The reviews page is a **read-only dashboard** following established patterns. Infrastructure (types, components, styling) is solid. 

**Next steps would be adding:**
- Server actions for review management (retry, send now, etc.)
- Interactive UI (buttons, confirmation modals)
- Detail view / expanded view for individual requests
- Filtering/sorting if needed

