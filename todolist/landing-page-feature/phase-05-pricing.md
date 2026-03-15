# Phase 05 — Pricing

**Status:** ✅ DONE
**Priority:** HIGH — conversion moment; must handle Free tier correctly

---

## File to Create

`app/components/landing/pricing-section.tsx` (Server Component, ~100 lines)

---

## Design

`id="pricing"` for navbar anchor.
Background: `--brand-bg` (`#F8F7F4`).
2 cards side-by-side on desktop, stacked on mobile.

---

## Tasks

- [ ] Section `id="pricing"`
- [ ] Section heading (H2, `--brand-navy`): *"Simple Pricing. No Surprises."*

### Free Card
- [ ] Badge: emerald `"Start here"` label (`--brand-emerald`)
- [ ] Price: **$0 / month**
- [ ] Feature list (checkmarks):
  - ✅ 3 customers / month
  - ✅ 3 automated review emails / month
  - ✅ Basic job dashboard
  - ✅ Click tracking
- [ ] CTA: `"Get Started Free"` (outline/ghost style, navy border) → `/auth/signup`
- [ ] Card style: white bg, border, rounded-xl, shadow-sm

### Pro Card
- [ ] Badge: `"Most Popular"` (amber bg, navy text)
- [ ] Price: **$19 / month** (placeholder — TBD)
  - Small note: *"Less than the cost of 1 lost customer"*
- [ ] Feature list:
  - ✅ Unlimited customers
  - ✅ Unlimited automated emails
  - ✅ Review tracking & analytics
  - ✅ Custom email delay (1–72h)
  - ✅ Priority support
- [ ] CTA: `"Start Pro Trial"` (amber button) → `/auth/signup`
- [ ] Card style: white bg, navy border-2, rounded-xl, shadow-md (slightly elevated)

### Below Cards
- [ ] Risk reducer text (centered, `--text-muted`):
  > *"No contracts. Cancel anytime. Upgrade or downgrade whenever."*

---

## Success Criteria
- [ ] Free card CTA navigates to `/auth/signup`
- [ ] Pro card visually elevated / "most popular" badge clear
- [ ] Price $19 placeholder visible (easy to update later)
- [ ] Responsive — stacks cleanly on mobile
