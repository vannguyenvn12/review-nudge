# Phase 2 — Shared Components

**Status:** ✅ Completed
**Depends on:** Phase 1
**Used by:** Phases 3, 4, 5, 6, 7

---

## Goal
Build 3 reusable presentational components used across all dashboard pages. No data fetching — props only.

---

## Files to Create

| File | Description |
|------|-------------|
| `app/dashboard/components/stats-card.tsx` | Big number card for overview stats |
| `app/dashboard/components/status-badge.tsx` | Coloured pill for job/review status |
| `app/dashboard/components/empty-state.tsx` | Empty table placeholder with optional CTA |

---

## Implementation Details

### `stats-card.tsx`
```ts
// Props
{ label: string; value: string | number; subtitle?: string }
```
- White card with subtle border
- Large bold number, smaller label above, optional subtitle below
- Used in Phase 3 Overview (4 cards)

### `status-badge.tsx`
```ts
// Props
{ status: JobStatus | ReviewRequestStatus }
```
Colour map (Tailwind v4 classes):

| Status | Background | Text |
|--------|-----------|------|
| `completed` | yellow-100 | yellow-800 |
| `review_sent` | blue-100 | blue-800 |
| `reviewed` | green-100 | green-800 |
| `pending` | gray-100 | gray-600 |
| `sent` | blue-100 | blue-800 |
| `failed` | red-100 | red-800 |
| `clicked` | purple-100 | purple-800 |

- Import types from `lib/types/database.ts`
- Inline pill: `rounded-full px-2 py-0.5 text-xs font-medium`

### `empty-state.tsx`
```ts
// Props
{ message: string; ctaLabel?: string; ctaHref?: string }
```
- Centered text with muted color
- Optional `<Link>` button CTA below message
- Used when tables have no rows

---

## Tasks
- [x] Create `stats-card.tsx`
- [x] Create `status-badge.tsx` with all 7 status colours
- [x] Create `empty-state.tsx`
- [x] Verify types imported from `lib/types/database.ts`

---

## Success Criteria
- All 3 components render without TypeScript errors
- `status-badge.tsx` covers all possible `JobStatus` and `ReviewRequestStatus` values
- `empty-state.tsx` renders CTA link only when `ctaLabel` + `ctaHref` provided
