# Phase 00 — Foundation

**Status:** ✅ DONE
**Priority:** HIGH — must be done first, all sections depend on CSS vars

---

## Files to Modify

- `app/globals.css`
- `app/layout.tsx`

---

## Tasks

### globals.css
- [ ] Remove line 18: `font-family: Arial, Helvetica, sans-serif;` (conflicts with Geist via `--font-sans`)
- [ ] Add brand CSS custom properties under `:root`:

```css
--brand-navy: #1B2B4B;       /* nav bg, headings, primary brand */
--brand-navy-dark: #0F1C33;  /* pain strip, bottom CTA, footer bg */
--brand-amber: #F59E0B;      /* primary CTA buttons ONLY */
--brand-bg: #F8F7F4;         /* warm off-white page background */
--brand-emerald: #10B981;    /* free badge, success states */
--text-primary: #111827;     /* high-contrast body text */
--text-muted: #6B7280;       /* captions, helper text */
```

### layout.tsx
- [ ] Update `metadata.title` → `"Review Nudge — Automate Your Google Reviews"`
- [ ] Update `metadata.description` → `"Automatically request Google reviews from customers after every completed job. Free tier included — no credit card required."`

---

## Success Criteria
- [ ] `npm run dev` — no console errors
- [ ] Geist font loads correctly (no Arial fallback visible)
- [ ] CSS vars accessible via browser DevTools
