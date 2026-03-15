# Phase 4 — Customers Page (`/dashboard/customers`)

**Status:** ⬜ Pending
**Depends on:** Phase 1, Phase 2

---

## Goal
Build the customers management page: list all customers + add new customer form.

---

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `app/dashboard/customers/page.tsx` | Server Component | Fetch + render list, include form |
| `app/dashboard/customers/add-customer-form.tsx` | `"use client"` | Add customer form |
| `app/dashboard/customers/actions.ts` | `"use server"` | `createCustomerAction` |

---

## Implementation Details

### `page.tsx`
```ts
const supabase = await createClient()
const { data: customers } = await supabase
  .from('customers')
  .select('id, name, email, phone')
  .order('name')
```
- Render `<AddCustomerForm />` above table
- Table cols: **Name** · **Email** · **Phone**
- Empty state: `<EmptyState message="No customers yet" />`

### `add-customer-form.tsx`
```ts
"use client"
const [state, action] = useActionState(createCustomerAction, null)
```
- Fields: `name` (required), `email` (type=email), `phone`
- Submit button with `useFormStatus` pending state
- Show `state.error` if present
- Reset form on success (via `key` trick or controlled inputs)

### `actions.ts — createCustomerAction`
```ts
"use server"
// 1. Get user session
// 2. Validate: name required
// 3. supabase.from('customers').insert({ user_id, name, email, phone })
// 4. revalidatePath('/dashboard/customers')
// 5. Return null on success, { error } on failure
```

---

## Tasks
- [ ] Create `actions.ts` with `createCustomerAction`
- [ ] Create `add-customer-form.tsx` with validation + pending state
- [ ] Replace shell `page.tsx` with real implementation
- [ ] Verify customer appears in list after submit
- [ ] Verify empty state renders when no customers
- [ ] Verify error message shown on duplicate/invalid data

---

## Success Criteria
- Form submits → customer appears in table without page refresh (revalidatePath)
- Required field validation works (name)
- Error state displayed correctly
- Empty state shows when customer list is empty
- No TypeScript errors
