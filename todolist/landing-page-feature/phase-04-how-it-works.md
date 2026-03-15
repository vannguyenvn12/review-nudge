# Phase 04 — How It Works

**Status:** ✅ DONE
**Priority:** HIGH — removes "is this too complicated?" objection

---

## File to Create

`app/components/landing/how-it-works-section.tsx` (Server Component, ~70 lines)

---

## Design

White background. 3-step horizontal layout on desktop, vertical on mobile.
**id="how-it-works"** — required for navbar + hero scroll anchor.

---

## Tasks

- [ ] Section `id="how-it-works"` for scroll anchor
- [ ] Section heading (H2, `--brand-navy`): *"Dead Simple. Works in 3 Steps."*
- [ ] 3 steps displayed as cards/columns:

  | Step | Title | Description |
  |------|-------|-------------|
  | **1** | Add Your Review Link | Paste your Google Review URL. Takes 30 seconds. |
  | **2** | Log a Completed Job | Enter customer name + email after finishing a job. |
  | **3** | We Email Them For You | Review Nudge sends a warm, timed email automatically. |

- [ ] Step number in amber circle (`--brand-amber`), bold number, navy text
- [ ] Tagline below steps (centered, `--text-muted`):
  > *"No integrations. No complicated setup. Works from day one."*
- [ ] CTA below tagline (amber button): **"Start Free →"** → `/auth/signup`
- [ ] Padding: `py-24 px-6`, max-width `max-w-6xl mx-auto`

---

## Success Criteria
- [ ] Scrolling from hero "See How It Works ↓" lands on this section
- [ ] 3 steps clearly numbered with amber circles
- [ ] CTA present and links to `/auth/signup`
