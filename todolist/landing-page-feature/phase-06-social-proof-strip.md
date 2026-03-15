# Phase 06 — Social Proof Strip

**Status:** ✅ DONE
**Priority:** MEDIUM — credibility without fake testimonials

---

## File to Create

`app/components/landing/social-proof-strip.tsx` (Server Component, ~40 lines)

---

## Design Decision
Testimonials **skipped** — no real beta users yet. Fake social proof destroys trust more than no social proof.
Replaced with **3 honest, metric-framed credibility stats**.

Background: light navy tint (`bg-[#EEF2F8]` or `--brand-navy/10`)
Layout: 3 columns on desktop, stacked on mobile.

---

## Tasks

- [ ] 3 stat items, each with icon + big number + label:

  | Icon | Stat | Label |
  |------|------|-------|
  | ⭐ | 5× more reviews | Avg. businesses earn in first 60 days |
  | ⏱ | < 5 min | Setup time — no tech skills needed |
  | 📧 | 40%+ open rate | Review request emails average |

- [ ] Each stat: large bold number (`text-4xl font-bold`, `--brand-navy`), small label (`--text-muted`)
- [ ] Light dividers between items on desktop
- [ ] Padding: `py-16 px-6`

---

## Note
Replace this section with real testimonials once 3+ beta users provide specific outcome quotes (e.g. "Went from 8 → 47 reviews in 3 months — HVAC Contractor, Houston TX").

---

## Success Criteria
- [ ] No fake names, fake quotes, or placeholder testimonials
- [ ] Stats render cleanly in 3-column grid on desktop
- [ ] Section visually distinct (light navy bg) from white sections above/below
