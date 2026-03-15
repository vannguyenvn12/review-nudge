# Phase 01 — Navbar

**Status:** ✅ DONE
**Priority:** HIGH — appears on every page load

---

## File to Create

`app/components/landing/navbar.tsx` (Server Component, ~50 lines)

---

## Tasks

- [ ] Sticky top bar — `sticky top-0 z-50`
- [ ] Background: `--brand-navy` (`#1B2B4B`)
- [ ] Left: "Review Nudge" logo text (white, bold) — no image needed yet
- [ ] Center/right nav links (desktop): `How It Works` | `Pricing` | `FAQ`
  - Each is an anchor link: `#how-it-works`, `#pricing`, `#faq`
  - Text: white, hover: amber underline
- [ ] Right CTA button: **"Start Free"**
  - Background: `--brand-amber` (`#F59E0B`)
  - Text: dark navy (`--brand-navy`)
  - href: `/auth/signup`
  - hover: slightly darker amber
- [ ] Mobile: hamburger menu or collapse links (simple — stack vertically on `sm:`)
- [ ] Max width container: `max-w-6xl mx-auto px-6`

---

## Success Criteria
- [ ] Stays sticky on scroll
- [ ] "Start Free" CTA navigates to `/auth/signup`
- [ ] Responsive — no overflow on mobile
