# Phase 03 — Pain Strip

**Status:** ✅ DONE
**Priority:** MEDIUM — psychological tension before the solution

---

## File to Create

`app/components/landing/pain-strip.tsx` (Server Component, ~30 lines)

---

## Design

Full-width dark banner. No CTA — pure emotional tension.
Background: `--brand-navy-dark` (`#0F1C33`)
Text: white
Layout: 3 columns on desktop, stacked on mobile

---

## Tasks

- [ ] Full-width section with dark navy bg
- [ ] 3 pain bullet items, each with a warning/red icon (❌ or 🔴):
  1. *"You finished the job. They meant to leave a review. They forgot."*
  2. *"Your competitor has 140 reviews. You have 12."*
  3. *"Google ranks the business with more reviews. Period."*
- [ ] Each bullet: icon + bold short line + muted explanation line
- [ ] **No CTA** — this section exists purely to agitate the pain
- [ ] Padding: `py-14 px-6`

---

## Success Criteria
- [ ] Visually distinct from surrounding sections (dark contrast)
- [ ] No CTA button anywhere in this section
- [ ] Readable on mobile (stacks to single column)
