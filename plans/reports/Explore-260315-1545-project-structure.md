# Exploration Report: Review Nudge Project Structure

**Date:** 2026-03-15 | **Status:** Complete

---

## 1. Directory Structure (2 levels deep)

```
review-nudge/
├── app/
│   ├── layout.tsx          # Root layout (Geist fonts, generic metadata)
│   ├── page.tsx            # Home page (still has Next.js boilerplate)
│   ├── globals.css         # Tailwind v4 + CSS variables
│   ├── auth/
│   │   ├── login/
│   │   │   ├── page.tsx    # Login page (server component + redirect)
│   │   │   ├── login-form.tsx # Client form w/ useActionState
│   │   │   └── actions.ts  # Server action (signInAction)
│   │   ├── signup/
│   │   │   ├── page.tsx    # Signup page
│   │   │   ├── signup-form.tsx # Client form
│   │   │   └── actions.ts  # Server action
│   │   └── callback/
│   │       └── route.ts    # OAuth callback handler
│   └── dashboard/
│       └── page.tsx        # STUB: Just returns <div>DashboardPage</div>
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client (createClient)
│   │   ├── server.ts       # Server Supabase client + admin client
│   │   └── middleware.ts   # Auth middleware (assumed)
│   ├── resend/
│   │   ├── client.ts       # Resend API client
│   │   ├── review-request-email.tsx # Email template (React Email)
│   │   └── send-review-request.ts # Logic to send emails
│   └── types/
│       └── database.ts     # TS types for all 4 DB tables + generics
├── public/               # Static assets (next.svg, vercel.svg)
├── package.json          # Dependencies
├── tsconfig.json         # TS config
├── next.config.ts        # Next.js config
├── tailwind.config.js    # Tailwind v4 config
├── postcss.config.mjs    # PostCSS config
├── .env.local            # Environment vars (not committed)
├── .example.env          # Example env template
├── middleware.ts         # Auth middleware (Next.js)
└── schema.sql            # DB schema (4 tables + RLS)
```

---

## 2. Key Files Content Summary

### 2.1 **app/page.tsx** (Home page)
- **Status:** Boilerplate (not customized for Review Nudge)
- **Content:**
  - Generic Next.js template with Next.js + Vercel logos
  - Links to "Deploy Now" and "Documentation"
  - Needs replacement with proper landing page

### 2.2 **app/layout.tsx** (Root layout)
- Imports Geist Sans + Geist Mono fonts
- Sets generic metadata: `"Create Next App"` (not updated)
- Applies CSS variable classes but no theme logic yet
- 35 lines

### 2.3 **app/auth/login/login-form.tsx** (Client form)
- **Client component** with `useActionState` (React 19)
- Form fields: email, password
- Uses `signInAction` server action from `./actions`
- Error display inline
- Submit button shows loading state (`pending`)
- Link to signup page
- ~84 lines

### 2.4 **app/auth/signup/signup-form.tsx** (Similar pattern)
- Same structure as login-form
- Likely has email, password, password confirm, etc.
- Uses `signUpAction` server action

### 2.5 **app/auth/login/page.tsx** (Server component)
- Redirects authenticated users → `/dashboard`
- Renders login layout + `<LoginForm />`
- 30 lines

### 2.6 **app/dashboard/page.tsx** (Dashboard)
- **STUB ONLY:** Returns just `<div>DashboardPage</div>`
- Needs full implementation (stats, customers, jobs, reviews)
- 5 lines

### 2.7 **lib/supabase/server.ts** (Server client)
- `createClient()` — SSR-aware client (reads/writes cookies via Next.js)
- `createAdminClient()` — Service role bypass (for post-signup logic)
- Both typed with `<Database>` generic

### 2.8 **lib/supabase/client.ts** (Browser client)
- `createClient()` — Browser-side Supabase
- Uses ANON key (publishable key, not deprecated in 2026)
- Returns typed `Database` client
- 15 lines

### 2.9 **lib/types/database.ts** (Type definitions)
- **Exports:**
  - `Profile`, `Customer`, `Job`, `ReviewRequest` (Row types)
  - `JobStatus`, `ReviewRequestStatus` (Union types)
  - Insert/Update type variants (Omit<> patterns)
  - `Database` generic schema for Supabase PostgREST
- All tables typed with correct nullable fields
- 107 lines (comprehensive)

### 2.10 **lib/resend/review-request-email.tsx** (Email template)
- **React Email** template component
- Props: `customerName`, `businessName`, `googleReviewUrl`
- Output: HTML table-based email (mobile-responsive)
- Features:
  - Greeting + thank-you message
  - Blue CTA button ("Leave a Google Review ⭐")
  - Fallback link
  - Footer disclaimer
- 166 lines (well-structured)

### 2.11 **lib/resend/send-review-request.ts**
- Assumed to export a function that:
  - Takes job + profile + customer data
  - Renders `ReviewRequestEmail` component
  - Calls `resend.emails.send()` with React template
  - Updates DB status

---

## 3. Package.json Dependencies

**Production:**
- `next@16.1.6` (App Router, SSR)
- `react@19.2.3` + `react-dom@19.2.3`
- `@supabase/supabase-js@^2.99.1` (ORM + realtime)
- `@supabase/ssr@^0.9.0` (SSR helpers)
- `resend@^6.9.3` (Email API)
- `@polar-sh/nextjs@^0.9.4` (Payments — not yet integrated)

**Dev:**
- `tailwindcss@^4` (latest v4)
- `@tailwindcss/postcss@^4`
- `typescript@^5` (strict mode)
- `eslint@^9` + `eslint-config-next`

---

## 4. Existing Dashboard-Related Files

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| `app/dashboard/page.tsx` | **STUB** | 5 | Root dashboard page — returns empty `<div>` |
| `app/auth/login/page.tsx` | ✅ Complete | 30 | Redirects auth'd users to `/dashboard` |
| `app/auth/signup/page.tsx` | ✅ Complete | 32 | Signup page (same redirect logic) |
| `lib/supabase/server.ts` | ✅ Complete | 48 | DB access layer ready |
| `lib/types/database.ts` | ✅ Complete | 107 | Type definitions (all 4 tables) |

**Missing / Incomplete:**
- Dashboard layout (`app/dashboard/layout.tsx`)
- Dashboard pages:
  - Overview/stats
  - Customers CRUD
  - Jobs CRUD
  - Reviews tracking
- API routes for CRUD operations
- Middleware auth enforcement

---

## 5. Architecture Insights

### Current State
1. **Auth flow:** Supabase Auth + Next.js SSR ✅
2. **Database:** Typed Supabase client ready ✅
3. **Email templates:** React Email component ready ✅
4. **Styling:** Tailwind v4 configured ✅
5. **Dashboard:** **Not started** ❌

### Next Steps (Recommended)
1. Replace boilerplate `page.tsx` with landing page
2. Implement dashboard layout + sidebar nav
3. Create dashboard overview page (stats cards)
4. Build customer & job management tables
5. Implement API routes for CRUD
6. Add review request scheduling logic
7. Deploy to Vercel

### Key Observations
- **RLS:** Database has row-level security (enforced at DB level)
- **Server actions:** Using React 19 + useActionState pattern (no form libraries)
- **Email:** React Email template is production-ready
- **Admin client:** Available for trusted server-side operations post-signup
- **Environment:** All vars documented in `.example.env`

---

## 6. Unresolved Questions

1. **Dashboard layout:** Will it have a sidebar, top nav, or both?
2. **Stats metrics:** What KPIs on the overview page (sent, clicked, reviewed counts)?
3. **Jobs table:** Inline edit, modal edit, or separate edit page?
4. **Email scheduling:** Cron job, Vercel Crons, or external task queue?
5. **Polar.sh:** Is subscription gating planned? How to integrate?

