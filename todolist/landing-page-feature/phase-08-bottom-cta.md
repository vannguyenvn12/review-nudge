# Phase 08 — Bottom CTA

**Status:** ✅ DONE
**Priority:** HIGH — captures scrollers who reached the bottom (high intent)

---

## File to Create

`app/components/landing/bottom-cta-section.tsx` (Server Component, ~35 lines)

---

## Design

Full-width dark section. **Different headline from hero** — same destination, fresh angle.
Background: `--brand-navy-dark` (`#0F1C33`)
Text: white
Centered layout.

---

## Tasks

- [ ] Heading (H2, white, `text-4xl font-bold`):
  > *"Every Job You Finish Is a Review Waiting to Happen."*
- [ ] Sub-copy (white/80 opacity):
  > *"Start collecting reviews on autopilot today."*
- [ ] Primary CTA button (amber, large):
  - Text: `"Start Getting Reviews — It's Free"`
  - href: `/auth/signup`
  - Style: `bg-[var(--brand-amber)] text-[var(--brand-navy)] font-bold px-10 py-4 rounded-lg text-lg hover:scale-[1.03] transition-transform`
- [ ] Risk reducer below button (small, white/60 opacity):
  > *"3 customers free · No credit card · Setup in 5 minutes"*
- [ ] Padding: `py-28 px-6`

---

## Success Criteria
- [ ] Visually distinct from hero (dark vs light)
- [ ] Headline different from hero headline (reinforces without repeating)
- [ ] Amber CTA clearly visible against dark bg
- [ ] Risk reducer copy present beneath button
