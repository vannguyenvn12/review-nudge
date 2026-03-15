# Phase 6 — Reviews Page (`/dashboard/reviews`)

**Status:** ✅ Done
**Depends on:** Phase 1, Phase 2

---

## Goal
Build a read-only reviews page showing all review requests with their status — gives the business owner visibility into email performance.

---

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `app/dashboard/reviews/page.tsx` | Server Component | Review requests table |

---

## Implementation Details

### `page.tsx`
```ts
const supabase = await createClient()
const { data: reviewRequests } = await supabase
  .from('review_requests')
  .select(`
    id,
    scheduled_at,
    sent_at,
    status,
    jobs (
      service_type,
      completed_at,
      customers ( name )
    )
  `)
  .order('scheduled_at', { ascending: false })
```

### Table Columns
| Column | Source | Notes |
|--------|--------|-------|
| **Customer** | `jobs.customers.name` | |
| **Service** | `jobs.service_type` | |
| **Scheduled At** | `scheduled_at` | Formatted date/time |
| **Sent At** | `sent_at` | `'—'` if null |
| **Status** | `status` | `<StatusBadge />` |

- Empty state: `<EmptyState message="No review requests yet. Log a job to trigger one." />`
- No mutations on this page — read-only

---

## Tasks
- [ ] Replace shell `page.tsx` with real implementation
- [ ] Nested Supabase select: `review_requests → jobs → customers`
- [ ] Render table with all 5 columns
- [ ] Format dates consistently
- [ ] Show `'—'` for null `sent_at`
- [ ] Handle empty state

---

## Success Criteria
- Table shows all review requests with correct data
- `<StatusBadge />` renders correct colour for each status
- `sent_at` shows `'—'` when email not yet sent
- Empty state shows when no requests exist
- No TypeScript errors
