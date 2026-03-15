# Phase 5 — Jobs Page (`/dashboard/jobs`)

**Status:** ✅ Done
**Depends on:** Phase 1, Phase 2, Phase 4 (customers must exist)

---

## Goal
Build the job logging page. Logging a job **automatically** inserts a `review_request` row scheduled at `now + delay_hours`. This is the core feature of Review Nudge.

---

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `app/dashboard/jobs/page.tsx` | Server Component | Job list + log form |
| `app/dashboard/jobs/log-job-form.tsx` | `"use client"` | Log a new job form |
| `app/dashboard/jobs/customer-select.tsx` | `"use client"` | Customer dropdown (split for 200-line limit) |
| `app/dashboard/jobs/actions.ts` | `"use server"` | `logJobAction` — inserts job + review_request |

---

## Implementation Details

### `page.tsx`
```ts
const supabase = await createClient()
const [{ data: jobs }, { data: customers }] = await Promise.all([
  supabase.from('jobs')
    .select('id, service_type, completed_at, status, customers(name), review_requests(scheduled_at)')
    .order('completed_at', { ascending: false }),
  supabase.from('customers').select('id, name').order('name'),
])
```
- If `customers.length === 0`: render `<EmptyState message="Add a customer first" ctaLabel="Add Customer" ctaHref="/dashboard/customers" />` — no form
- Otherwise: render `<LogJobForm customers={customers} />` + jobs table
- Table cols: **Customer** · **Service** · **Completed At** · **Status** · **Review Scheduled At**

### `customer-select.tsx`
```ts
// Props: { customers: { id: string; name: string }[]; name: string }
// Controlled select element — receives customers list from parent form
```

### `log-job-form.tsx`
```ts
"use client"
const [state, action] = useActionState(logJobAction, null)
```
- Fields: `customer_id` (select via `<CustomerSelect />`), `service_type` (text, required), `completed_at` (datetime-local, defaults to now), `notes` (textarea, optional)
- Submit with `useFormStatus` pending state
- Show `state.error` if present

### `actions.ts — logJobAction` (CRITICAL SEQUENCE)
```ts
"use server"
// 1. Get user session
// 2. Validate: customer_id + service_type required
// 3. Insert job: { user_id, customer_id, service_type, completed_at, status: 'completed', notes }
// 4. Fetch profile: supabase.from('profiles').select('delay_hours').eq('id', user.id).single()
// 5. Calculate: scheduled_at = new Date(Date.now() + delay_hours * 3600 * 1000)
// 6. Insert review_request: { job_id: job.id, status: 'pending', scheduled_at }
// 7. revalidatePath('/dashboard/jobs')
// 8. Return null on success, { error } on failure
```

---

## Tasks
- [x] Create `actions.ts` with `logJobAction` (job insert + review_request insert)
- [x] Create `customer-select.tsx`
- [x] Create `log-job-form.tsx`
- [x] Replace shell `page.tsx` with real implementation
- [x] Verify: logging a job creates both `jobs` row AND `review_requests` row
- [x] Verify: `scheduled_at` = `completed_at` + `delay_hours` hours
- [x] Verify: guard shows empty state when no customers exist
- [x] Verify: table shows review scheduled time

---

## Success Criteria
- `logJobAction` atomically creates job + review_request in correct sequence
- `review_requests.scheduled_at` equals job completion time + profile's `delay_hours`
- No customers guard prevents form from rendering
- Jobs table shows all columns including review scheduled time
- No TypeScript errors
