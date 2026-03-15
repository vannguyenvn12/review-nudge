# Phase 09 — Footer

**Status:** ✅ DONE
**Priority:** LOW — required but minimal

---

## File to Create

`app/components/landing/footer.tsx` (Server Component, ~30 lines)

---

## Design

Simple, minimal footer. Same dark navy bg as bottom CTA section for visual continuity.
Background: `--brand-navy-dark` (`#0F1C33`)
Border-top: subtle white/10 divider

---

## Tasks

- [ ] Logo text "Review Nudge" (white, left)
- [ ] Nav links (center or right, small, white/60):
  - Privacy Policy (placeholder href `#`)
  - Terms of Service (placeholder href `#`)
  - Contact (placeholder href `#`)
- [ ] Copyright line: `© 2026 Review Nudge. All rights reserved.`
- [ ] Layout: flex row on desktop, stacked on mobile
- [ ] Padding: `py-8 px-6`, max-width `max-w-6xl mx-auto`

---

## Note
Privacy/Terms pages are placeholders — links can use `href="#"` until real pages exist.

---

## Success Criteria
- [ ] Renders without broken links causing console errors
- [ ] No orphaned white space below footer
- [ ] Responsive on mobile
