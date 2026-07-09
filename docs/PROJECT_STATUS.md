# Project Status — Xưởng Váy Cưới Bến Tre

> Update this file after every meaningful development batch.
> Last updated: **2026-07-09** (Phase 2 — production homepage implemented)

## Current Phase
**Roadmap Phase 3 implemented → awaiting review, then Phase 4 (Wedding dress listing).**

## Phase 3 (2026-07-09): Collection discovery
- `/collections` — editorial index over real `/rentals/categories/` (Server Component, ISR 5m); count-adaptive grid (1 → full-width banner, odd count → first tile spans row); distinct states for API-unreachable vs genuinely-empty catalog
- `/collections/[slug]` — breadcrumb + editorial hero (name, description, design count) + ProductCard grid + prev/next pagination driven by DRF `previous`/`next` (`dynamicParams = true`, dynamic route); unknown slug → real 404 only when the API confirmed it; API failure → degraded editorial state, never a false 404
- Category slug resolution goes through the cached list (backend has no slug-retrieve for categories — UUID lookup only); one memoized fetch serves both `generateMetadata` and the page
- New shared components: `CategoryTile` (extracted from home CategoryDiscovery — now reused by both) and `EmptyState` (premium editorial empty/error state)
- Branded `src/app/not-found.tsx` (404 with header/footer, CTAs home/collections)

## Verification (2026-07-09, Phase 3)
- `tsc --noEmit` 0 · `lint` 0 · `build` ✅ (`/collections` static ISR 5m; `/collections/[slug]` dynamic)
- Chrome review: index (1-category banner), `/collections/vay` (breadcrumb, hero, 1-item grid, real production data), unknown slug → branded 404; 375px iframe viewport overflow-free (JS-asserted); zero console errors

## Phase 2 (2026-07-09): Production homepage
- `/` showcase replaced by the editorial homepage: `src/features/home/` — `HeroSection` (full-viewport charcoal, transparent header integration), `BrandManifesto`, `CategoryDiscovery` (asymmetric grid from real `/rentals/categories/`, count-adaptive), `EditorialStory` (static, asymmetric), `FeaturedProducts` (`?is_featured=true&status=available`, max 4, omits when empty), `EditorialBreak`, `WhyChooseUs` (numbered editorial, no invented stats), `AppointmentProcess` (3 steps), `LookbookSection` (recent items, mixed ratios, omits below 3 items), `FinalAppointmentCTA`
- Header now auto-selects `transparent` variant on `/` (hero sits behind it via negative margin)
- Data: Server Component + `Promise.all`, independent `.catch(() => [])` per request, ISR 300 s (build output confirms `Revalidate 5m`); **no fake inventory anywhere** — data sections omit themselves when empty
- Homepage SEO: local-keyword title/description, `canonical /`, OG block
- Live contract re-verified against the production API (read-only GETs): paginated shape, category fields, clothing fields incl. `cover_image_url: ""` null-media case
- `.env.local` currently points at the production API for review (local Django was down); switch back to `http://localhost:8000` for backend development

## Completed
- Phase 0: workspace audit, FOXIE read-only audit, API capability matrix, scaffold, handbook set, `D:\LEARN\WORKSPACE.md` (details: git-less history in this file's previous revision)
- **Phase 1 (2026-07-09): design system & global shell**
  - `src/components/ui/`: `Button` (5 variants × 3 sizes, button+Link polymorphic), `SectionHeading` (eyebrow/title/description/align/CTA/onDark), `ProductCard` (image-first 3:4, verified Clothing subset only, status/featured badges, CSS placeholder for null media)
  - `src/components/layout/`: `Container`, `Section` (ivory/cream/dark tones), `AnnouncementBar`, `Header` (client — sticky, 3-column desktop, full-screen charcoal mobile menu with Escape/scroll-lock/route-change close, future `transparent` variant for hero), `Footer` (charcoal editorial, 3 link columns, CTA)
  - Utilities: `cn()`, `formatPrice()` (VND), `NAV_LINKS`/footer link constants
  - Tokens refined in `globals.css`: warm-white `#FFFDF9`, cream `#F3EEE5` (per visual spec), global `:focus-visible` ring, `prefers-reduced-motion` support
  - Root layout composes AnnouncementBar + Header + main + Footer
  - `/` is a temporary **Design System Showcase** (`robots: noindex`) with local mock data — NOT the final homepage

## Verification (2026-07-09, Phase 2)
- `tsc --noEmit` ✅ 0 · `lint` ✅ 0 · `build` ✅ (`/` static, ISR 5m) — no `any`/`@ts-ignore`/`eslint-disable`
- Chrome review at 375 / 768 (iframe viewport harness, overflow JS-asserted false) and desktop: hero + transparent header, single-category banner layout, FeaturedProducts correctly omitted (0 featured in prod), process/CTA/footer correct; zero console errors
- Art-director fix applied during review: Lookbook requires ≥ 3 items (1 item read as empty)

## Verification (2026-07-09, Phase 1)
- `npx tsc --noEmit` ✅ exit 0 · `npm run lint` ✅ exit 0 (after fixing a set-state-in-effect and unused-var findings properly, no suppressions) · `npm run build` ✅ static `/` + `/_not-found`
- Local UI review in Chrome at 375 / 768 / desktop viewports via same-origin iframe harness: no horizontal overflow (JS-verified at 375 & 768), announcement bar, header states, mobile menu open/close, product-card badges & placeholders, dark section, footer stacking all correct; zero console errors on fresh load
- Screen widths 1280/1440 covered by capped `max-w-6xl/7xl` layout verified at ~1912px

## In Progress
- Nothing — awaiting manual homepage review (`npm run dev` → http://localhost:3100).

## Blocked
- Nothing blocking development. Launch-time dependency: CORS env-var addition on Railway (Phase 10, approval required).

## Planned (next)
1. Review homepage + collections, then commit Phase 3 as one controlled commit (approval required)
2. Phase 4: `/wedding-dresses` listing with supported filters
3. Content prerequisite (via FOXIE Admin): categories for váy cưới / vest / áo dài, `is_featured` flags, cover images

## Production Status
Not deployed. Git repository initialized 2026-07-09 (`main`, single baseline commit covering Phases 0–2); no GitHub remote or Vercel project yet.

## API Dependencies
- `GET /rentals/categories/`, `GET /rentals/clothing/` (+filters), `GET /rentals/clothing/{slug}/` — public, verified
- `POST /leads/submit/`, `POST /bookings/submit/` — public; **payload serializers not yet read — verify before Phase 7**

## Known Issues
- Backend gaps inherited from FOXIE (not fixable here): public serializer exposes internal lifecycle fields; no color/size/price-range server filters; no availability calendar; no submit throttling. Details: API_INTEGRATION.md §2.
- Category taxonomy depends on production content that doesn't exist yet.
- Header/footer nav links point at planned routes (`/wedding-dresses`, `/collections`, …) that 404 until Phases 3–6 ship — intentional during development.
- Header `transparent` variant is implemented but unused until the Phase 2 hero; per-route variant wiring (route group or prop) decided in Phase 2.

## Next Recommended Action
Review Phase 3 at `/collections`, approve the controlled commit, create the private GitHub repository and push, then start Phase 4 (Wedding dress listing).
