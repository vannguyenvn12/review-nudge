# Phase 11 — Verify & Build

**Status:** ✅ DONE
**Priority:** CRITICAL — must pass before shipping

---

## Tasks

### Dev Server Checks (`npm run dev`)
- [ ] Visit `localhost:3000` — full landing page renders
- [ ] **Scroll test:** page flows correctly through all 9 sections
- [ ] **Anchor links:**
  - Navbar "How It Works" → scrolls to `#how-it-works`
  - Navbar "Pricing" → scrolls to `#pricing`
  - Navbar "FAQ" → scrolls to `#faq`
  - Hero "See How It Works ↓" → scrolls to `#how-it-works`
- [ ] **CTA links:** All amber buttons → navigate to `/auth/signup`
- [ ] **FAQ accordion:** Each item expands/collapses on click
- [ ] **Mobile (DevTools → 375px):**
  - Navbar stacks or collapses correctly
  - Hero is single column, readable
  - Pricing cards stack vertically
  - No horizontal overflow / scrollbar
- [ ] **Browser console:** Zero errors, zero warnings

### Typography & Colors
- [ ] Geist Sans font loads (no Arial/Helvetica fallback visible)
- [ ] Amber color appears ONLY on CTA buttons (not headers, icons, etc.)
- [ ] Dark sections (pain strip, bottom CTA, footer) have correct `--brand-navy-dark` bg

### Lint Check (`npm run lint`)
- [ ] Zero ESLint errors
- [ ] Zero ESLint warnings (or only known acceptable ones)

### Production Build (`npm run build`)
- [ ] Build completes with exit code 0
- [ ] Zero TypeScript errors
- [ ] No `next/image` warnings (no Image components used in landing)
- [ ] Bundle size reasonable (no unexpected large deps added)

---

## Sign-off Criteria
All checkboxes above must be ticked before marking this phase complete and the feature as shipped.
