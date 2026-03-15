# CLAUDE.MD — Review Nudge

> AI agent guidance for this project. Read before planning or implementing anything.

## Project Overview

**Review Nudge** is a SaaS platform that helps service businesses (contractors, agencies, etc.) automatically request Google reviews from customers after a completed job.

**Core flow:**

1. Business owner signs up and configures their Google review URL + delay hours
2. Logs completed jobs with customer info
3. System schedules review request emails (configurable delay, default 2h)
4. Sends emails via Resend at scheduled time
5. Tracks click/reviewed status per request

## Tech Stack

| Layer     | Technology                   |
| --------- | ---------------------------- |
| Framework | Next.js 15 (App Router, RSC) |
| Language  | TypeScript 5 (strict mode)   |
| Styling   | Tailwind CSS v4              |
| Database  | Supabase PostgreSQL + RLS    |
| Auth      | Supabase Auth + SSR          |
| Email     | Resend                       |
| Payments  | Polar.sh (@polar-sh/nextjs)  |
| Runtime   | Node.js / Vercel             |

## Project Structure

```
review-nudge/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (Geist fonts)
│   ├── page.tsx            # Home/landing page
│   └── globals.css         # Tailwind v4 + CSS variables
├── public/                 # Static assets
├── schema.sql              # Database schema (4 tables)
├── .env.local              # Environment variables (not committed)
├── next.config.ts
├── tsconfig.json
├── tailwind.config / postcss.config.mjs
└── eslint.config.mjs
```

## Database Schema

```sql
profiles        -- Business owner profile (linked to auth.users)
  id, email, full_name, business_name
  google_review_url, delay_hours (default: 2)

customers       -- Customer records per business owner
  id, user_id → profiles, name, email, phone

jobs            -- Completed service jobs
  id, user_id, customer_id → customers
  service_type, completed_at
  status: 'completed' | 'review_sent' | 'reviewed'
  notes

review_requests -- Scheduled/sent review request emails
  id, job_id → jobs
  scheduled_at, sent_at
  status: 'pending' | 'sent' | 'failed' | 'clicked' | 'reviewed'
```

- RLS enabled on all tables (ownership enforced)
- Triggers ensure jobs belong to user's own customers
- Cascade deletes on user removal

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
POLAR_API_KEY=           # (likely needed for Polar.sh)
```

## Development Status

**Done:** DB schema, dependencies, config, env vars
**Not yet built:** Auth UI, API routes, dashboard, components, email templates

## Recommended App Structure (to implement)

```
app/
├── api/
│   ├── customers/          # CRUD endpoints
│   ├── jobs/               # Job management
│   └── review-requests/    # Scheduling + sending
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/page.tsx
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx            # Overview stats
│   ├── customers/page.tsx
│   ├── jobs/page.tsx
│   └── reviews/page.tsx
├── components/             # Shared UI components
└── lib/
    ├── supabase.ts         # Client/server Supabase setup
    ├── types.ts            # TypeScript interfaces for DB rows
    └── email-templates/    # Resend email templates
```

## Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

## Key Conventions

- Use App Router patterns (Server Components by default, `"use client"` only when needed)
- All DB access goes through Supabase client (`lib/supabase.ts`)
- RLS handles authorization — always pass user context to queries
- Email sending via Resend API (server-side only)
- Polar.sh handles subscription/payment webhooks
- Keep files under 200 lines; split by concern
- kebab-case file names; PascalCase component names
