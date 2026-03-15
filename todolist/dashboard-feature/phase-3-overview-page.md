# Phase 3 — Overview Page (`/dashboard`)

**Status:** ✅ Completed
**Depends on:** Phase 1, Phase 2

---

## Goal
Replace the stub `app/dashboard/page.tsx` with a real overview showing 4 stats cards and a recent jobs table.

---

## Files to Modify / Create

| File | Action | Description |
|------|--------|-------------|
| `app/dashboard/page.tsx` | Replace stub | Stats cards + recent jobs table |

---

## Implementation Details

### Data Fetching (parallel)
```ts
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

const [{ data: jobs }, { data: recentJobs }, { data: rr }] = await Promise.all([
  supabase.from('jobs').select('id, status'),
  supabase.from('jobs')
    .select('id, service_type, completed_at, status, customers(name)')
    .order('completed_at', { ascending: false })
    .limit(10),
  supabase.from('review_requests').select('id, status'),
])
```

### Stats Calculations
| Card | Formula |
|------|---------|
| Total Jobs | `jobs.length` |
| Emails Sent | `rr.filter(r => !['pending','failed'].includes(r.status)).length` |
| Clicked | `rr.filter(r => ['clicked','reviewed'].includes(r.status)).length` |
| Conversion % | `(reviewed / sent * 100).toFixed(1) + '%'` — show `'—'` if sent = 0 |

### Recent Jobs Table
Columns: **Customer** · **Service** · **Completed At** · **Status**
- Date format: `new Date(completed_at).toLocaleDateString()`
- Status rendered with `<StatusBadge />`
- Empty state: `<EmptyState message="No jobs logged yet" ctaLabel="Log your first job" ctaHref="/dashboard/jobs" />`

---

## Tasks
- [x] Replace `app/dashboard/page.tsx` stub with real implementation
- [x] Parallel fetch: all jobs (for stats) + recent 10 jobs + all review_requests
- [x] Render 4 `<StatsCard />` components
- [x] Render recent jobs table with `<StatusBadge />`
- [x] Handle empty state (no jobs yet)
- [x] Verify stats calculate correctly

---

## Success Criteria
- 4 stats cards display accurate numbers
- Recent jobs table shows customer name, service, date, status badge
- Empty state shows when no jobs exist
- No TypeScript errors
