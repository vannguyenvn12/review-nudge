# Plan: Auth — Sign Up & Sign In (Supabase SSR)
**Date:** 260315 | **Slug:** auth-signup-signin  
**Stack:** Next.js 15 App Router · TypeScript strict · Tailwind v4 · Supabase SSR

---

## Files to Create

| # | File | Type | Purpose |
|---|------|------|---------|
| 1 | `app/auth/signup/page.tsx` | Server Component (shell) | Renders signup form, imports server action |
| 2 | `app/auth/signup/actions.ts` | Server Actions | `signUpAction` — creates auth user + upserts profile |
| 3 | `app/auth/login/page.tsx` | Server Component (shell) | Renders login form, imports server action |
| 4 | `app/auth/login/actions.ts` | Server Actions | `signInAction` — authenticates user |
| 5 | `app/auth/callback/route.ts` | Route Handler | Exchanges OAuth/magic-link code → session |
| 6 | `app/auth/login/login-form.tsx` | Client Component | Controlled form with error display |
| 7 | `app/auth/signup/signup-form.tsx` | Client Component | Controlled form with error display |

> **Why split page + form?** Page is a Server Component (can be async, read cookies); form is Client Component (needs `useState` for field errors & pending state via `useFormStatus`).

---

## 1. `app/auth/signup/actions.ts`

**Responsibility:** Single server action `signUpAction(formData: FormData)`.

**Steps:**
1. Extract: `email`, `password`, `full_name`, `business_name`, `google_review_url`, `delay_hours` from `formData`.
2. Validate: `email` and `password` non-empty; `delay_hours` coerced to int (default `2`).
3. Call `createClient()` from `lib/supabase/server.ts`.
4. `supabase.auth.signUp({ email, password })` — capture `{ data, error }`.
5. On error → return `{ error: error.message }`.
6. On success, upsert profile:
   ```ts
   supabase.from("profiles").upsert({
     id: data.user!.id,
     email,
     full_name: full_name || null,
     business_name: business_name || null,
     google_review_url: google_review_url || null,
     delay_hours: parsed_delay_hours,
   })
   ```
7. On upsert error → return `{ error: upsertError.message }`.
8. `redirect("/dashboard")` (Next.js `redirect()` from `next/navigation`).

**Error return shape:** `{ error: string } | never` (redirect never returns).

---

## 2. `app/auth/signup/signup-form.tsx` (Client Component)

**Responsibility:** Renders all signup fields, calls `signUpAction` via `<form action={signUpAction}>`, displays errors.

**State:**
- `error: string | null` — read from action return via `useActionState` (React 19 / Next.js 15 pattern).
- `isPending` via `useFormStatus` inside submit button.

**Fields (all as `<input>`):**
- `email` type=email, required
- `password` type=password, required
- `full_name` type=text, optional
- `business_name` type=text, optional
- `google_review_url` type=url, optional
- `delay_hours` type=number min=1, optional (placeholder "2")

**UX:** Disable submit while pending; show error banner above submit button; link to `/auth/login`.

---

## 3. `app/auth/signup/page.tsx`

Simple async Server Component. No data fetching needed.
- Check if user already logged in via `createClient()` → `supabase.auth.getUser()`.
- If authenticated → `redirect("/dashboard")`.
- Render `<SignupForm />`.

---

## 4. `app/auth/login/actions.ts`

**Responsibility:** Single server action `signInAction(formData: FormData)`.

**Steps:**
1. Extract `email`, `password`.
2. Validate non-empty.
3. `createClient()` → `supabase.auth.signInWithPassword({ email, password })`.
4. On error → return `{ error: error.message }`.
5. `redirect("/dashboard")`.

---

## 5. `app/auth/login/login-form.tsx` + `app/auth/login/page.tsx`

Same pattern as signup. Page checks auth → redirect if logged in. Form has 2 fields (email, password), error display, link to `/auth/signup`.

---

## 6. `app/auth/callback/route.ts`

**Responsibility:** Handle Supabase auth code exchange (OAuth, magic link, email confirm).

**Steps:**
1. `GET` handler, extract `code` and optional `next` from `request.nextUrl.searchParams`.
2. If `code` present: `createClient()` → `supabase.auth.exchangeCodeForSession(code)`.
3. `redirect(next ?? "/dashboard")`.
4. If no `code`: `redirect("/auth/login")`.

**Note:** `next` param allows post-confirm deep-linking; default to `/dashboard`.

---

## 7. Route Protection Strategy

Extend **existing** `lib/supabase/middleware.ts` → `updateSession` to add redirect logic:

```
After getUser():
  - pathname starts with /dashboard → user null → redirect to /auth/login
  - pathname starts with /auth      → user exists → redirect to /dashboard
```

**Single place, no duplication.** The root `middleware.ts` already calls `updateSession` on every request — just augment the return logic there.

> **Why middleware, not page-level?** Avoids flash of protected content; one canonical place; works for all `/dashboard/*` sub-routes automatically.

---

## 8. Profile Upsert Integration

- Upsert runs **inside `signUpAction`** immediately after successful `signUp`.
- Uses `onConflict: "id"` behavior (Supabase upsert default for primary key).
- Email confirmation flow: Supabase may return `user` with `identities` but `session: null` if email confirmation is enabled. Plan handles both:
  - If `data.session` is null → upsert still runs (user.id is available), then show "check your email" message instead of redirect.
  - If `data.session` exists (confirmation disabled) → upsert + redirect `/dashboard`.
- Callback route (`/auth/callback`) handles the confirm link → after `exchangeCodeForSession`, user is now confirmed; profile was already upserted at signup time.

---

## 9. Error Handling

| Scenario | Handling |
|----------|----------|
| Missing email/password | Client-side `required` attr + server-side check → `{ error }` |
| Duplicate email | Supabase returns error → displayed in form |
| Profile upsert fail | Return error string; user can retry login (profile upserted on next signup attempt) |
| Network/unknown | Catch-all → generic "Something went wrong" message |
| Already logged in visiting /auth/* | Middleware redirects to /dashboard |

---

## 10. File Size Budget

| File | Est. Lines |
|------|-----------|
| `signup/actions.ts` | ~50 |
| `signup/signup-form.tsx` | ~90 |
| `signup/page.tsx` | ~25 |
| `login/actions.ts` | ~35 |
| `login/login-form.tsx` | ~60 |
| `login/page.tsx` | ~20 |
| `callback/route.ts` | ~25 |

All under 200 lines. ✓

---

## 11. Dependency Graph

```
middleware.ts
  └── lib/supabase/middleware.ts  (extend: add redirect logic)

app/auth/signup/page.tsx          (Server Component)
  └── app/auth/signup/signup-form.tsx   (Client Component)
        └── app/auth/signup/actions.ts  (Server Action)
              └── lib/supabase/server.ts

app/auth/login/page.tsx
  └── app/auth/login/login-form.tsx
        └── app/auth/login/actions.ts
              └── lib/supabase/server.ts

app/auth/callback/route.ts
  └── lib/supabase/server.ts
```

---

## Implementation Order

1. `lib/supabase/middleware.ts` — add route protection redirects
2. `app/auth/callback/route.ts`
3. `app/auth/login/actions.ts` + `login-form.tsx` + `page.tsx`
4. `app/auth/signup/actions.ts` + `signup-form.tsx` + `page.tsx`

---

## Unresolved Questions

- **Email confirmation enabled?** If yes, signup action should return a "check your email" message instead of redirecting. Needs project Supabase config check.
- **`useActionState` availability:** Next.js 15 + React 19 — confirm `useActionState` is available (it is in React 19; fallback is `useFormState` from `react-dom` for React 18).
- **Post-callback profile upsert gap:** If email confirmation is ON and user visits confirm link but profile upsert failed silently at signup, profile row may be missing. Consider adding a profile upsert also in the callback route as a safety net.
