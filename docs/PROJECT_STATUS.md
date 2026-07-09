# Project Status — Xưởng Váy Cưới Bến Tre

> Update this file after every meaningful development batch.
> Last updated: **2026-07-10** (Phase 5 — wedding dress product detail implemented, uncommitted)

## Current Phase
**Roadmap Phase 5 implemented → awaiting review, then a controlled commit, then Phase 6 (Suit & áo dài sections).**

## Phase 5 (2026-07-10): Wedding dress product detail
- `/wedding-dresses/[slug]` — resolves the remaining `ProductCard` 404 site-wide (homepage, collections, wedding-dresses listing all link here). `dynamicParams = true`; renders dynamic (reads `params`); `generateMetadata` and the page both call the same `getProduct(slug)` helper — Next's fetch memoization dedupes the underlying request, same non-`cache()` pattern as `/collections/[slug]`
- Breadcrumb → editorial 2-column layout (gallery ~58%, sticky info panel ~42% on `md+`, stacked on mobile) → related designs. Info panel: category · code eyebrow, name, rental price (+ sale price when `sale_price !== null`), status badge (reused `STATUS_LABELS`, now exported from `ProductCard`), description, a restrained spec list (chất liệu/màu sắc/kích thước — each row omitted when its field is empty, no icon grid), then CTAs
- **Gallery** (`src/features/clothing/ProductGallery.tsx`) — the only client boundary on the page, and only mounted when `images.length > 0` (today's real product has 0 images, so production currently ships zero gallery JS). Cover image first (mirrors the backend's own cover-image fallback), then a magazine-style masonry grid for supporting images (reused the `columns-2` + mixed-aspect-ratio technique from `LookbookSection`) — deliberately not a thumbnail-rail/ecommerce gallery. Clicking any image opens a full-screen viewer (`role="dialog"`, `aria-modal`, Escape/←/→ keyboard nav, body scroll lock, focus to close button) using `object-contain` so the **true, uncropped image** is visible there even though grid previews use `object-cover` crops for visual rhythm (consistent with every other image grid in this codebase)
- **CTA architecture**: primary "Đặt lịch thử váy" → `${ROUTES.appointment}?product={slug}`; secondary "Liên hệ tư vấn" → `${ROUTES.contact}?product={slug}` — both routes are still unimplemented (Phase 7), consistent with the existing intentional-404 pattern already used for other CTAs elsewhere. No booking API mutation implemented (out of scope this phase). When `status !== 'available'`, the primary CTA is replaced with a status message + a "Xem thiết kế còn trống" link to `/wedding-dresses?status=available` (reuses the Phase 4 filter) — satisfies the documented "disable inquiry CTA, suggest alternatives" rule from API_INTEGRATION.md §5
- **Related designs**: `fetchClothingList({ category: product.category_slug })`, excludes the current product by id client-side (no backend "exclude" filter exists), capped at 3, section omitted entirely when 0 remain (true today for the only real product — it's alone in its category)
- **State handling**: valid product / sparse product (null description, empty colors/sizes/images) / API-confirmed unknown slug → `notFound()` (reuses the existing global `not-found.tsx`) / API failure → degraded `EmptyState`, never a false 404 — verified all four distinctly (see Verification below)
- New API finding during this phase's audit: `ClothingDetailSerializer` uses `fields = '__all__'` (confirmed in FOXIE source, read-only), so the live detail response also leaks `archived_at` and `created_by` beyond the previously-documented internal fields. Neither is typed in `ApiClothingDetail` and neither is rendered — expands the known backend over-exposure gap (see Known Issues)

## Verification (2026-07-10, Phase 5)
- `tsc --noEmit` 0 · `lint` 0 · `build` ✅ (`/wedding-dresses/[slug]` ƒ dynamic) · `git diff --check` clean
- Browser-driven review (Playwright + headless Chromium) at 375/768/1280/1440px against the real product (`abc-vay-vip-1`, 0 images — confirms the sparse/null-media path) **and** against synthetic API responses (via a local reverse-proxy that mocked three specific test slugs while transparently forwarding every other request to the real production API — nothing committed, scratch-only): zero horizontal overflow, zero console errors across every check
- Confirmed via the proxy: multi-image gallery grid renders correctly at all 4 breakpoints; lightbox opens via click and via Enter key, `aria-modal="true"`, ArrowRight/Left navigate without closing, Escape closes (dialog count → 0); unavailable-status product correctly shows the disabled-CTA + alternatives message; simulated API failure (aborted connection) → confirmed the page shows the degraded `EmptyState` (not the 404 page — double-checked the "không còn ở đây" 404 string only appeared inside a `<script>` RSC payload, never in the live-rendered body); API-confirmed unknown slug → real branded 404 (verified HTTP 404 status)
- Regression: `/`, `/collections`, `/collections/vay`, `/wedding-dresses` all render with zero overflow/console errors; `ProductCard` links from `/collections/vay` and `/wedding-dresses` now resolve `200` (previously the documented intentional 404). Homepage/collections-index currently show 0 `ProductCard` links — correct and expected, not a regression: `FeaturedProducts` needs `is_featured` items (0 in production) and `LookbookSection` needs ≥ 3 items (1 in production), both still correctly self-omitting

## Phase 4 (2026-07-10): Wedding dress listing
- `/wedding-dresses` — editorial listing over the full `/rentals/clothing/` catalog (Server Component; renders dynamically because it reads `searchParams`, same as `/collections/[slug]`). No category slug is hardcoded/pinned: only one `RentalCategory` exists in production today (`vay` / "Váy"), and pinning a slug now would violate the no-hardcoded-production-data rule and break the moment more categories are added — revisit pinning once real taxonomy exists (Phase 6 note below)
- Filters — all link/form-driven, **zero client JS**: category chips sourced from real `/rentals/categories/`; a single "chỉ hiện thiết kế còn trống" toggle (`?status=available`); 4 ordering options (`?ordering=`, default `-created_at`); free-text search (`?search=` via native `<form method="get">`) — every filter maps 1:1 to a verified backend filterset field. No color/size/price-range filters — confirmed absent from the backend filterset, per API_INTEGRATION.md §2
- Three distinct, never-conflated states: API-unreachable (categories and/or clothing fetch failed) vs. genuinely-empty catalog vs. "no results for the current filters" (with a clear-filters CTA)
- Extracted `Pagination` (DRF `previous`/`next`-driven) out of `CollectionDetail` into `src/components/shared/Pagination.tsx`, now shared by `/collections/[slug]` and `/wedding-dresses` with no behavior change to the former
- Route fix: `ROUTES.weddingDresses` (`/wedding-dresses`) now resolves — the header/footer nav, hero CTA, and "Xem tất cả thiết kế" button already pointed here and previously 404'd. `ROUTES.weddingDress(slug)` (`/wedding-dresses/[slug]`, used by every `ProductCard`) is unchanged and still 404s — that is Phase 5 scope, deferred this session per explicit instruction; same intentional-404 pattern already documented below for other unshipped routes

## Verification (2026-07-10, Phase 4)
- `tsc --noEmit` 0 · `lint` 0 · `build` ✅ (`/wedding-dresses` ƒ dynamic, same rendering class as `/collections/[slug]`)
- Live checks against the real production API (dev server on :3100, curl): `/wedding-dresses` → 200 with real data ("Váy Vip 1"); every category/status/ordering/search combination → 200; unknown category slug → graceful "no results" empty state, not an error page; no-match search → correct empty state with a clear-filters CTA; homepage nav link and `/collections/vay` ProductCard both still correctly resolve to `/wedding-dresses` and `/wedding-dresses/[slug]` respectively; global header/footer shell present; pagination correctly self-omits for the current single-page result set
- **Not done this session:** no headless-browser/screenshot tool was available, so responsive layout at 375/768/1280/1440 was not visually captured. The page reuses the exact grid/section classes already visually verified in Phase 3 (`grid-cols-2 md:grid-cols-3 xl:grid-cols-4`, same `Container`/`Section`/`ProductCard`); the new filter bar uses the same `flex-wrap` / `flex-col md:flex-row` primitives used elsewhere in the shell — low regression risk, but a manual pass is recommended before commit

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
- Nothing — Phase 5 implemented and verified, awaiting review and commit approval.

## Blocked
- Nothing blocking development. Launch-time dependency: CORS env-var addition on Railway (Phase 10, approval required).

## Planned (next)
1. Review Phase 5 (`/wedding-dresses/[slug]`), then a controlled commit (approval required)
2. Phase 6: reuse the Phase 4/5 listing + detail components for `/suits` and `/ao-dai` once those categories exist in production
3. Content prerequisite (via FOXIE Admin): categories for vest / áo dài, `is_featured` flags, cover images, and product photography — needed before Phase 6 is meaningful and before the Phase 5 gallery/related-designs sections are exercised by real traffic

## Production Status
Not deployed. Git repository initialized 2026-07-09 (`main`); GitHub remote `origin` connected. Pushed commits: `7145860` (baseline), `22a421b` (Phase 3), `b66be0a` (Phase 4). Phase 5 work is implemented but **uncommitted**. No Vercel project yet.

## API Dependencies
- `GET /rentals/categories/`, `GET /rentals/clothing/` (+filters), `GET /rentals/clothing/{slug}/` — public, verified
- `POST /leads/submit/`, `POST /bookings/submit/` — public; **payload serializers not yet read — verify before Phase 7**

## Known Issues
- Backend gaps inherited from FOXIE (not fixable here): public serializer exposes internal lifecycle fields — confirmed as of 2026-07-10 to include `purchase_date`, `purchase_price`, `last_rental_date`, `rental_count`, `sold_date`, `sold_price`, `retirement_reason`, `quantity`, **and (newly confirmed) `archived_at`, `created_by`** (the detail serializer uses `fields = '__all__'`); no color/size/price-range server filters; no availability calendar; no submit throttling. Details: API_INTEGRATION.md §2.
- Category taxonomy depends on production content that doesn't exist yet — only one `RentalCategory` (`vay`) exists in production, so `/wedding-dresses` shows the full catalog rather than a pinned category (see Phase 4 note above).
- The Phase 5 gallery (multi-image grid + lightbox) and related-designs section are only verified against synthetic/mocked data this session — real production data is a single product with 0 images and no category siblings, so neither has been exercised by real traffic yet.
- Header/footer nav links to `/suits`, `/ao-dai`, `/rental`, `/appointment`, `/about`, `/contact` still 404 until their phases ship — intentional during development. The `/wedding-dresses/[slug]` CTAs now link to `?product={slug}`-suffixed `/appointment` and `/contact` URLs in anticipation of Phase 7's form reading that context.
- Header `transparent` variant is implemented but unused until the Phase 2 hero; per-route variant wiring (route group or prop) decided in Phase 2.

## Next Recommended Action
Review `/wedding-dresses/[slug]` (product detail, gallery, CTAs), approve a controlled commit, push, then start Phase 6 (Suit & áo dài sections) — content-gated on FOXIE Admin categories.
