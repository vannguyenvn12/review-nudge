# Phase 02 — Hero Section

**Status:** ✅ DONE
**Priority:** HIGH — first thing visitors see, most critical for conversion

---

## File to Create

`app/components/landing/hero-section.tsx` (Server Component, ~80 lines)

---

## Layout

2-column on desktop (`md:grid-cols-2`), single column on mobile.
Background: `--brand-bg` (`#F8F7F4`)
Padding: `py-24 px-6`, max-width `max-w-6xl mx-auto`

---

## Tasks

### Left Column — Copy & CTAs
- [ ] **Headline** (H1, `text-5xl font-bold`, `--brand-navy`):
  > "Your Customers Will Leave Reviews. Without You Asking."
- [ ] **Sub-headline** (`text-xl`, `--text-muted`):
  > "Log a completed job → Review Nudge emails your customer at the perfect moment, automatically."
- [ ] **Primary CTA** (amber button, full-width on mobile):
  - Text: `"Start Getting Reviews Free"`
  - href: `/auth/signup`
  - Style: `bg-[var(--brand-amber)] text-[var(--brand-navy)] font-bold px-8 py-4 rounded-lg hover:scale-[1.03] transition-transform`
- [ ] **Secondary CTA** (ghost/outline):
  - Text: `"See How It Works ↓"`
  - href: `#how-it-works`
  - Style: border navy, text navy, hover bg-navy/5
- [ ] **Trust micro-copy** beneath buttons (small, muted):
  > "Free tier included · No credit card required · 5-minute setup"

### Right Column — Product Mockup
- [ ] Styled div mockup simulating the dashboard job list:
  - Card with shadow, white bg, rounded
  - 3 fake job rows: customer name + status badge (Sent ✅ / Pending 🕐 / Reviewed ⭐)
  - Caption: *"Review emails sent automatically after every job"*
  - Use Tailwind for styling — no real screenshot needed yet

---

## Success Criteria
- [ ] Passes "3-second billboard test" — value prop immediately clear
- [ ] Amber button visible above fold on all screen sizes
- [ ] Secondary CTA scrolls to `#how-it-works`
- [ ] Mockup renders without images (pure CSS/HTML)
