# Phase 7 — Settings Page (`/dashboard/settings`)

**Status:** ✅ Done
**Depends on:** Phase 1

---

## Goal
Build the settings page where business owners configure their Google review URL, send delay, and business name. These settings directly affect review request emails.

---

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `app/dashboard/settings/page.tsx` | Server Component | Fetch profile + render form |
| `app/dashboard/settings/settings-form.tsx` | `"use client"` | Settings form |
| `app/dashboard/settings/actions.ts` | `"use server"` | `updateSettingsAction` |

---

## Implementation Details

### `page.tsx`
```ts
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
const { data: profile } = await supabase
  .from('profiles')
  .select('business_name, google_review_url, delay_hours')
  .eq('id', user.id)
  .single()
```
- **Warning banner** (if `!profile?.google_review_url`):
  `⚠ Set your Google review URL — emails won't send until this is configured.`
- Render `<SettingsForm profile={profile} />`

### `settings-form.tsx`
```ts
"use client"
const [state, action] = useActionState(updateSettingsAction, null)
```
Fields:
| Field | Type | Validation |
|-------|------|-----------|
| `business_name` | text | optional |
| `google_review_url` | url | optional but warned |
| `delay_hours` | number | min=0, step=0.5 |

- Pre-populate with current profile values
- Submit with `useFormStatus` pending state
- Show success message on `state.success`
- Show error on `state.error`

### `actions.ts — updateSettingsAction`
```ts
"use server"
// 1. Get user session
// 2. Parse: business_name, google_review_url, delay_hours (parseFloat)
// 3. Validate: delay_hours >= 0
// 4. supabase.from('profiles').update({ business_name, google_review_url, delay_hours }).eq('id', user.id)
// 5. revalidatePath('/dashboard/settings')
// 6. Return { success: true } | { error: string }
```

---

## Tasks
- [ ] Create `actions.ts` with `updateSettingsAction`
- [ ] Create `settings-form.tsx` with pre-populated fields
- [ ] Create `page.tsx` with warning banner logic
- [ ] Verify settings persist after reload
- [ ] Verify warning banner appears/disappears based on `google_review_url`
- [ ] Verify success message shows after save

---

## Success Criteria
- All 3 fields save correctly to `profiles` table
- Warning banner shown when `google_review_url` is null/empty, hidden when set
- Form pre-populated with current values on load
- Success/error feedback displayed after submit
- No TypeScript errors
