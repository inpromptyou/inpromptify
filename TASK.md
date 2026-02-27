# Task: Dashboard Overhaul + Fix Test Creation + Add Discovery + Upgrade Prompt

## Overview
Fix multiple issues across InpromptiFy. Do ALL of these. Test the build compiles after.

## 1. Fix Test Creation (Publishing a test fails)

The `/api/tests/create/route.ts` works fine. But the create page (`src/app/dashboard/create/page.tsx`) has issues:
- The entire create page uses **light theme** classes (`bg-white`, `bg-gray-50`, `border-gray-200`, `text-gray-900`, etc.) — must be converted to dark theme to match the rest of the app
- Design system (`src/lib/designSystem.ts`) uses light theme classes everywhere (`.card` = `bg-white`, `.input` = `border-gray-200 text-gray-900`, etc.)
- The `ds` object needs dark theme equivalents OR the create page should use inline dark classes
- Remove emojis from TEMPLATES array icons — use simple SVG icons or text labels instead
- Error styling uses light theme (`bg-red-50 border-red-100`) — change to dark

**The design system (`ds`) is used across many dashboard pages. Update it to dark theme:**
- `page`: keep layout, it's fine
- `pageTitle`: `text-gray-900` → `text-white`
- `pageSubtitle`: fine (already `text-gray-400`)
- `sectionTitle`: `text-gray-900` → `text-white`
- `card`: `bg-white border-gray-200/80` → `bg-[#0C1120] border-white/[0.06]`
- `cardHover`: same dark conversion
- `flatSection`: `border-gray-100` → `border-white/[0.06]`
- `btnPrimary`: `bg-indigo-600` is fine, but `hover:shadow-indigo-600/10` could be stronger
- `btnSecondary`: `bg-white border-gray-200 text-gray-700` → `bg-white/[0.04] border-white/[0.08] text-gray-400`
- `btnGhost`: `text-gray-500 hover:text-gray-700` → `text-gray-500 hover:text-gray-300`
- `input`: `border-gray-200 text-gray-900 placeholder:text-gray-300` → `bg-white/[0.04] border-white/[0.08] text-white placeholder:text-gray-600`
- `inputLabel`: `text-gray-500` → `text-gray-400`
- `tableRow`: `hover:bg-gray-50/80` → `hover:bg-white/[0.02]`
- `tableHeader`: fine
- `tableCell`: fine
- `tableCellMuted`: fine (already `text-gray-400`)
- `scoreBadge`: keep the colors, they work on dark bg too
- `sidebarItemActive`: update if needed

## 2. Remove ALL Mock/Fake Candidate Data from Dashboard

In `src/app/dashboard/page.tsx`:
- It imports `mockCandidates` and `dashboardStats` from `@/lib/mockData`
- Falls back to mock data when API returns nothing
- **FIX**: Show empty states instead. If no tests/candidates, show the "Get Started" panel only.
- Remove fake delta stats (`+2 from last week`, `+8`, `+3pts`, `12% less`) — either compute real deltas or remove them
- The stat card values showing `text-gray-900` need to be `text-white`
- Remove the "Efficiency Insight" banner that says "3.2x more tokens" (fake stat)

The `recentResults` table should show REAL data from DB or an empty state like:
```
No results yet. Create your first assessment to get started.
```

## 3. Redesign Dashboard Layout (Not just a side menu)

Current `DashboardLayout.tsx` is a plain sidebar + content area. The main content bg is `bg-gray-50` (light!).

Changes needed:
- Main content area: `bg-gray-50` → `bg-[#0A0F1C]`
- Mobile header: `bg-white border-gray-200` → `bg-[#0C1120] border-white/[0.06]`, text colors to white
- Add a **top bar** inside the main content area with: page title on left, user avatar + "Upgrade" button on right
- Sidebar border color: `border-[#14374A]` → `border-white/[0.06]` for consistency

The dashboard home page should be redesigned:
- Remove the big "Get Started" panel for users who have tests (keep for new users)
- Add a **command bar / quick actions** section at top: "Create Test", "Browse Tests", "Invite Candidate"
- Show stats in a more compact way
- Add an **upgrade prompt card** at the bottom of sidebar or in dashboard: "You're on Free (5 tests). Upgrade for unlimited." with a link to `/pricing`

## 4. Add Test Discovery Page

Create `src/app/explore/page.tsx` (or update if exists) — a public page where anyone can browse public tests.
- Fetch from `/api/tests/public` (already exists)
- Dark themed grid of test cards
- Each card: title, description snippet, difficulty badge, model, time limit, number of candidates
- Click → go to `/test/[id]` to take the test
- Filter by difficulty, type, sort by popularity
- This should NOT require login

Also add "Explore Tests" or "Browse Tests" to the main nav and dashboard sidebar.

## 5. Add Upgrade Prompt in Dashboard

- Add an upgrade card in the dashboard (not sidebar) that shows current plan and limits
- "Free Plan: 5 tests, 25 candidates/month" → "Upgrade to Pro" button linking to `/pricing`
- Make it a subtle but visible card, not intrusive

## Technical Notes
- Stack: Next.js 16, Tailwind v4 (use classes directly, no `@apply`), TypeScript 5.9
- Dark theme: `bg-[#0A0F1C]` page bg, `bg-[#0C1120]` cards, `border-white/[0.06]` borders, indigo accents
- No emojis anywhere on the site
- After all changes, run `npx next build` to verify no errors

## Files to modify:
- `src/lib/designSystem.ts` — dark theme update
- `src/app/dashboard/page.tsx` — remove mocks, redesign, add upgrade card
- `src/app/dashboard/create/page.tsx` — dark theme, remove emoji templates
- `src/components/DashboardLayout.tsx` — dark bg, add top bar, add explore link, upgrade in sidebar
- `src/app/explore/page.tsx` — test discovery page (create or update)
- Any other dashboard pages that use `ds` classes and look broken after the ds update
