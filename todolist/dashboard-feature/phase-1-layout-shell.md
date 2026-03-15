# Phase 1 — Layout + Shell Pages

**Status:** ✅ Done
**Blocker for:** All subsequent phases

---

## Goal
Create the persistent dashboard layout (top navbar) and empty shell pages for all 5 routes so navigation works end-to-end before any real content is built.

---

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `app/dashboard/layout.tsx` | Server Component | Reads user session; renders sticky top navbar |
| `app/dashboard/components/logout-button.tsx` | `"use client"` | Sign out + redirect to `/auth/login` |
| `app/dashboard/customers/page.tsx` | Server Component | Shell — `<div>Customers</div>` |
| `app/dashboard/jobs/page.tsx` | Server Component | Shell — `<div>Jobs</div>` |
| `app/dashboard/reviews/page.tsx` | Server Component | Shell — `<div>Reviews</div>` |
| `app/dashboard/settings/page.tsx` | Server Component | Shell — `<div>Settings</div>` |

---

## Implementation Details

### `app/dashboard/layout.tsx`
- Server Component — fetch user with `createClient()` from `lib/supabase/server.ts`
- Redirect to `/auth/login` if no session
- Render sticky top navbar containing:
  - Logo / brand name ("Review Nudge") on the left
  - Nav links: Overview · Customers · Jobs · Reviews · Settings
  - `<LogoutButton />` on the right with user display name/email
- Active link highlighting via `usePathname()` (needs wrapper Client Component or pass `pathname` down)
- `{children}` rendered below navbar with padding

### `app/dashboard/components/logout-button.tsx`
- `"use client"`
- Uses `createClient()` from `lib/supabase/client.ts`
- On click: `supabase.auth.signOut()` → `router.push('/auth/login')`
- Shows user email/name passed as prop

### Shell pages
- Minimal stub: just return a `<div>` with page name
- Will be replaced in Phases 3–7

---

## Tasks
- [x] Create `app/dashboard/layout.tsx`
- [x] Create `app/dashboard/components/logout-button.tsx`
- [x] Create `app/dashboard/components/nav-links.tsx`
- [x] Create shell `app/dashboard/customers/page.tsx`
- [x] Create shell `app/dashboard/jobs/page.tsx`
- [x] Create shell `app/dashboard/reviews/page.tsx`
- [x] Create shell `app/dashboard/settings/page.tsx`
- [x] Verify all 5 routes load without errors (`npm run build` ✅)

---

## Success Criteria
- Navigating `/dashboard`, `/dashboard/customers`, `/dashboard/jobs`, `/dashboard/reviews`, `/dashboard/settings` all render the navbar + page content
- Logout button works
- Unauthenticated users are redirected

---

## Notes
- `usePathname()` is a Client hook — either wrap nav links in a thin Client Component or use a CSS-only active approach with Next.js `<Link>`
- Reuse `createClient()` from `lib/supabase/server.ts` (already handles cookie refresh)
