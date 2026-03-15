# Phase 07 — FAQ

**Status:** ✅ DONE
**Priority:** MEDIUM — removes objections before checkout

---

## File to Create

`app/components/landing/faq-section.tsx` (**Client Component** — needs `"use client"` for accordion state, ~80 lines)

---

## Design

`id="faq"` for navbar anchor.
White background. Single column, max-width `max-w-3xl mx-auto`.
Accordion: click to expand/collapse each answer.

---

## Tasks

- [ ] `"use client"` directive at top (accordion state = `useState`)
- [ ] Section `id="faq"`
- [ ] Section heading (H2, `--brand-navy`): *"Common Questions"*
- [ ] 5 accordion items with smooth expand/collapse:

  | # | Question | Answer |
  |---|----------|--------|
  | 1 | Will it feel spammy to my customers? | The email is warm and personal — sent once per completed job, at the right time. Customers expect follow-up from a business they just hired. |
  | 2 | Is it hard to set up? | Under 5 minutes. Paste your Google Review URL, add a customer, log a job — done. No integrations, no tech skills required. |
  | 3 | What if they already left a review? | We track every email click. You can mark a job as "Reviewed" manually and no further emails are sent. |
  | 4 | Do I need a CRM or existing software? | No. Review Nudge is self-contained. Manual job logging is all you need to get started. |
  | 5 | How is this different from Podium or NiceJob? | Those tools are built for enterprises and priced accordingly ($200–500/mo). Review Nudge is built specifically for small service businesses — simple, affordable, focused. |

- [ ] Each item: border-b divider, question in bold navy, answer in `--text-muted`
- [ ] Expand icon: `+` / `−` toggle, right-aligned
- [ ] Smooth height transition (`max-h-0 → max-h-screen` with `overflow-hidden transition-all`)

---

## Success Criteria
- [ ] Each accordion opens/closes independently
- [ ] Smooth animation — no layout jump
- [ ] Works on mobile (touch tap)
- [ ] Question 5 explicitly addresses competitor differentiation
