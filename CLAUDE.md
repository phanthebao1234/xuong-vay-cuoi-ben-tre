# Xưởng Váy Cưới Bến Tre — CLAUDE.md

Project handbook + architecture guide + status document + Claude Code operating manual.
Companion docs: [ARCHITECTURE](docs/ARCHITECTURE.md) · [API_INTEGRATION](docs/API_INTEGRATION.md) · [DESIGN_SYSTEM](docs/DESIGN_SYSTEM.md) · [HOMEPAGE_STRATEGY](docs/HOMEPAGE_STRATEGY.md) · [ROADMAP](docs/ROADMAP.md) · [PROJECT_STATUS](docs/PROJECT_STATUS.md)
Cross-project rules: [`D:\LEARN\WORKSPACE.md`](../WORKSPACE.md)

---

## 0. Session Start Protocol

Every session must:

1. Read this file fully.
2. Read docs/ARCHITECTURE.md, docs/PROJECT_STATUS.md, docs/DESIGN_SYSTEM.md, docs/API_INTEGRATION.md, docs/ROADMAP.md.
3. Run:
   ```
   git branch --show-current
   git fetch origin
   git status -sb
   git status --short
   git log --oneline -10
   ```
4. Inspect the current implementation before proposing changes.
5. Identify unrelated working-tree changes and preserve them.
6. Audit before modifying. Never trust the snapshot in §19 over live `git status`.
7. Make the smallest logical change.
8. Run verification (`npx tsc --noEmit`, `npm run lint`, `npm run build` when production behavior changes).
9. Report before commit.
10. **Never commit, push, or deploy without explicit user approval.**

## 1. Project Overview

**Xưởng Váy Cưới Bến Tre** — luxury bridal fashion atelier website for the Bến Tre market.
Sells discovery + conversion: wedding dresses, bridal gowns, groom suits, áo dài cưới; rental inquiry; fitting-appointment booking; consultation conversion; local SEO.

- **Target customers:** couples in Bến Tre and nearby provinces planning weddings; brides researching dress rental on mobile.
- **Business objective:** turn visual discovery into appointment bookings and rental inquiries (hotline / form).
- **Relationship to FOXIE Studio:** independent frontend consuming the FOXIE production backend. Products are administered in the FOXIE Admin CMS (`/admin/rentals`). This project has no admin UI and no backend of its own.
- **Reference site** `aocuoivivian.com`: IA/commercial-flow inspiration ONLY — never clone visuals, copy text, or reuse its images.

## 2. Architecture

```
This frontend (separate Vercel project, own domain, port 3100 dev)
        │  public AllowAny endpoints only, read-mostly
        ▼
FOXIE Django REST API (Railway) — SHARED, treated as external & read-only
        ▼
PostgreSQL 16 + Cloudflare R2 (shared)
```

- Separate folder `D:\LEARN\xuong-vay-cuoi-ben-tre`, separate Git repo (when initialized), separate Vercel project, separate env vars, separate domain.
- Shared: backend API, database, R2 media, FOXIE Admin CMS for content.
- Full rationale + risk table: docs/ARCHITECTURE.md.

## 3. Technology Stack (verified)

Next.js **16.2.9** (App Router) · React **19.2.4** · TypeScript 5 strict · Tailwind CSS **v4** (`@theme` tokens in globals.css) · ESLint 9 flat config · `next/font/google` (Cormorant Garamond + Be Vietnam Pro, Vietnamese subsets). Versions pinned to match FOXIE's proven stack. No other runtime dependencies yet — add only with architectural approval.

## 4. Repository Structure

| Path | Responsibility |
|------|---------------|
| `src/app/` | Routes; data fetching only, pass props down |
| `src/components/{ui,layout,shared}` | Primitives / shell / cross-feature composites |
| `src/features/{home,collections,clothing,rental,appointment,contact}` | Page sections — props only, **no API calls inside features** |
| `src/lib/api/` | `client.ts` (public fetch core) + per-domain services |
| `src/lib/{config,utils,constants}` | `site.ts`, `media.ts`, `routes.ts` |
| `src/hooks/` | Client hooks (only when interactivity demands) |
| `src/types/index.ts` | ALL interfaces; API types prefixed `Api*` |
| `docs/` | Handbook set |

## 5. API Architecture Rules

- Base: `NEXT_PUBLIC_API_URL` + `/api/v1` (see `src/lib/api/client.ts`).
- **Public-only client. No JWT, no admin fetch, no token storage — ever, by design.** Admin tasks belong in FOXIE Admin.
- All list responses are paginated `{ count, results }` — use `unwrapResults()` / `.results ?? []`.
- ISR caching (default `revalidate: 300`) — not `no-store`.
- Pages call `src/lib/api/*` services, never raw `fetch`.
- Never invent API fields — verify against FOXIE serializer source and date the verification in `src/types/index.ts`.
- Public pages: `await fetchX().catch(() => fallback)` — never a blank page on API failure.
- Never render internal lifecycle fields the API leaks (`purchase_price`, `sold_price`, `rental_count`, `retirement_reason`, `quantity`, `purchase_date`).

## 6. Design System (summary — full rules in docs/DESIGN_SYSTEM.md)

Luxury Editorial Bridal Fashion. Tokens: ivory `#FBF9F4`, warm-white `#FFFDF9`, cream `#F3EEE5`, champagne `#C0A062` (restrained accent), charcoal `#2A2523`, taupe `#9C8E80`, line `#E9E2D6`. Serif display: Cormorant Garamond (`font-display`); sans body: Be Vietnam Pro (`font-body`). Image-first, generous whitespace, hairline borders, minimal radius, CSS-transition motion only (no animation library). Avoid: gradients, glassmorphism, SaaS cards, cheap gold, animation noise. Never reuse FOXIE's gold `#B88A44`. Implemented component rules: docs/DESIGN_SYSTEM.md §5.

## 7. Routes

**Implemented:** `/` (production homepage, 10 editorial sections, ISR 5m) · `/collections` (index over real categories, ISR 5m) · `/collections/[slug]` (dynamic: hero + grid + prev/next pagination; unknown slug → 404 only when API confirms; API failure → degraded editorial state) · `/wedding-dresses` (dynamic: full clothing catalog — no category slug pinned, see §18 Decision Log 2026-07-10; category/status/ordering/search filters, all link/form-driven with zero client JS; DRF prev/next pagination via shared `src/components/shared/Pagination.tsx`) · `/wedding-dresses/[slug]` (dynamic product detail — resolves the `ProductCard` 404 site-wide; gallery + info panel + related designs; see §18 for gallery/CTA/related-products decisions) · branded `not-found.tsx`. Global shell wraps all routes; Header renders its `transparent` variant on `/` automatically. Category slugs resolve through the cached categories list — the backend has no slug-retrieve for categories.
**Planned** (purpose/SEO/conversion/API table in docs/ARCHITECTURE.md §5): `/suits`, `/suits/[slug]`, `/ao-dai`, `/ao-dai/[slug]`, `/rental`, `/appointment`, `/about`, `/contact`.
`dynamicParams = true` on all detail routes (CMS-created slugs).

## 8. Data Domain (from FOXIE audit, 2026-07-09)

Backend `rentals` app provides publicly (AllowAny list/retrieve):
- `RentalCategory` — name/slug/description/sort_order/clothing_count → `GET /rentals/categories/`
- `Clothing` — code, name, slug, category(+name/slug), colors[], sizes[], material, rental_price, sale_price, 5-state status, is_featured, cover_image_url, images[] on detail → `GET /rentals/clothing/` (filters: `category` slug, `status`, `is_featured`, `search`, `ordering`) + `GET /rentals/clothing/{slug}/`
- `Accessory` — public list/detail
- Conversion: `POST /leads/submit/`, `POST /bookings/submit/` (AllowAny; **verify payload serializers before wiring forms**)

Gaps: no color/size/price-range server filters, no curated-collection entity, no availability calendar, public serializer over-exposes internal fields — confirmed 2026-07-10 via live detail response + FOXIE source (`ClothingDetailSerializer` uses `fields = '__all__'`) to include `archived_at` and `created_by` in addition to the previously-known `purchase_date`/`purchase_price`/`last_rental_date`/`rental_count`/`sold_date`/`sold_price`/`retirement_reason`/`quantity`; none of these are typed in `ApiClothingDetail` or rendered anywhere. Full matrix: docs/API_INTEGRATION.md §2.

## 9. SEO Strategy

Local-first, Vietnamese. Primary keywords: **váy cưới Bến Tre · thuê váy cưới Bến Tre · studio áo cưới Bến Tre · vest cưới Bến Tre · áo dài cưới Bến Tre**.
Per-route `generateMetadata`, `metadataBase` from `NEXT_PUBLIC_SITE_URL`, OG image, sitemap + robots, JSON-LD `LocalBusiness` + `Product`, canonical URLs, `lang="vi"`, human Vietnamese copy (no keyword stuffing). Implemented in Roadmap Phase 8.

## 10. Performance Rules

Server Components by default; `'use client'` only where interaction demands. `next/image` everywhere with accurate `sizes` per CSS layout; lazy-load below fold (hero may be `priority`). No heavy client libs without approval. Optimize CWV: stable layout (aspect ratios reserved), font `display: swap`, minimal JS. Lighthouse mobile perf ≥ 90 is the Phase 9 bar.

## 11. Security Rules

- No secrets in this repo, ever: no Django SECRET_KEY, no JWT secrets, no R2 keys, no DB credentials, no production tokens. Only `NEXT_PUBLIC_*` vars.
- No direct database access. No backend security logic duplicated client-side.
- This site never authenticates — any "needs auth" feature is out of scope / belongs to FOXIE Admin.

## 12. Git Safety

inspect first (`git status -sb`, `git diff`) · stage explicit paths only · **never `git add .` / `-A`** · one logical task = one commit · never force push · preserve unrelated changes & untracked user assets · run `npx tsc --noEmit` + `npm run lint` (+ `npm run build` for prod-behavior changes) + `git diff --check` before commit · **no commit/push without explicit approval**. GitHub remote `origin` connected 2026-07-09 (`https://github.com/phanthebao1234/xuong-vay-cuoi-ben-tre.git`); `main` pushed and tracked, HEAD in sync as of that date.

## 13. Shared Backend Safety

**DO NOT MODIFY THE FOXIE BACKEND (or any `D:\LEARN\foxie` file) FROM THIS PROJECT WITHOUT EXPLICIT AUTHORIZATION.**

Any shared backend/API-contract change requires, in order: (1) backend impact analysis, (2) FOXIE frontend regression analysis, (3) this frontend's impact analysis, (4) migration review if applicable, (5) explicit approval. The single anticipated exception at launch: adding this site's domain to `CORS_ALLOWED_ORIGINS` on Railway — an env-var change, still approval-gated.

## 14. Deployment (planned)

Separate Vercel project auto-deploying from this repo's `main` (once created) · shared Railway API (untouched) · env vars in Vercel dashboard: `NEXT_PUBLIC_API_URL=https://foxie-production.up.railway.app`, `NEXT_PUBLIC_SITE_URL=<own domain>` · verification: build log → production HTML metadata → API calls cross-origin → smoke test (Roadmap Phases 10–11).

## 15. Current Project Status

| Area | Status | Notes |
|------|--------|-------|
| Architecture & API audit | ✅ DONE | Capability matrix verified from backend source |
| Project scaffold | ✅ DONE | Builds clean; placeholder homepage only |
| Design tokens & fonts | ✅ DONE | globals.css `@theme` + next/font |
| API client + types | ✅ DONE | Public-only; rentals services typed |
| Handbook/docs | ✅ DONE | Full set in docs/ + WORKSPACE.md |
| Git repository | ✅ INITIALIZED | `main`, remote `origin` connected + pushed 2026-07-09 |
| Design system components + global shell | ✅ DONE | Phase 1 (2026-07-09) |
| Homepage | ✅ DONE | Phase 2 (2026-07-09) |
| Collection discovery | ✅ DONE | Phase 3 (2026-07-09); committed (`22a421b`), pushed |
| Wedding dress listing | ✅ DONE | Phase 4 (2026-07-10); committed (`b66be0a`), pushed |
| Wedding dress product detail | ✅ DONE | Phase 5 (2026-07-10); uncommitted, awaiting review |
| Catalog routes (remaining) | ⏳ PLANNED | Phase 6 (`/suits`, `/ao-dai`) — content-gated |
| Conversion forms | ⏳ PLANNED | Phase 7 — verify submit serializers first |
| SEO / perf | ⏳ PLANNED | Phases 8–9 |
| Deployment | ⛔ NOT STARTED | Phases 10–11 |
| Catalog content | ⛔ MISSING | RentalCategory rows + products needed in FOXIE Admin |

## 16. Current Priorities

1. Review Phase 5 (`/wedding-dresses/[slug]` — gallery, info panel, CTAs, related designs), then approve a controlled commit and push.
2. Phase 6: reuse the Phase 4/5 listing + detail components for `/suits` and `/ao-dai`.
3. Content prerequisite via FOXIE Admin: categories for vest / áo dài, `is_featured` flags, product photography — needed before Phase 6 is meaningful, and before the Phase 5 gallery/related-designs sections are exercised by real traffic (today's only real product has 0 images and no category siblings).
4. Before Phase 7: read leads/bookings submit serializers from FOXIE source and type the payloads.

## 17. Known Gaps (from API audit)

See docs/API_INTEGRATION.md §2 for the full matrix. Headlines: no server-side color/size/price-range filtering; no curated-collection entity (categories stand in); no availability calendar; no submit throttling; no "exclude id" or "related products" filter (related designs are derived client-side: fetch by category, filter out the current item, cap the count); public clothing serializers expose internal lifecycle fields including `archived_at` and `created_by` (confirmed 2026-07-10; never render them; backend fix needs cross-project approval).

## 18. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-09 | Separate frontend repo/folder; no monorepo | Zero risk to FOXIE production; independent deploy cadence |
| 2026-07-09 | Launch on existing rentals API, no backend changes | list/retrieve verified AllowAny; capability matrix sufficient for v1 |
| 2026-07-09 | Collections = `RentalCategory` 1:1 for v1 | No collection entity exists; avoid inventing backend |
| 2026-07-09 | Public-only API client, no JWT code at all | Attack-surface and simplicity; admin lives in FOXIE |
| 2026-07-09 | ISR (300 s) instead of `no-store` | Content catalog, not dashboard; CWV + backend load |
| 2026-07-09 | Cormorant Garamond + Be Vietnam Pro; champagne `#C0A062` | Distinct identity vs FOXIE (Playfair/Inter, `#B88A44`); native Vietnamese support |
| 2026-07-09 | Dev port 3100 | Coexist with FOXIE dev on 3000 |
| 2026-07-09 | Git init deferred until explicit approval; initialized later the same day (`main`, single baseline commit) | Controlled baseline over incremental history |
| 2026-07-09 | CSS transitions only for motion; no Framer Motion in this repo (Phase 1) | JS budget + editorial restraint; revisit only with approval |
| 2026-07-09 | Header is the sole client component; menu/scroll state stays inside it | Minimal client boundary, RSC layout preserved |
| 2026-07-09 | Data-driven homepage sections omit themselves when API data is empty (Lookbook needs ≥ 3 items) | Never fake inventory; editorial sections carry the page |
| 2026-07-09 | Homepage hero = CSS editorial composition, no stock/competitor imagery | No authorized photography exists yet; swap for CMS media later |
| 2026-07-09 | GitHub remote `origin` connected to an approved repository URL; `main` pushed | User-approved URL provided; remote verified empty before push, no force needed |
| 2026-07-10 | `/wedding-dresses` lists the full clothing catalog — no `RentalCategory` slug is pinned as "the wedding dress category" | Only one ambiguous category (`vay`) exists in production; hardcoding it would violate the no-hardcoded-production-data rule and break once more categories exist. Category filter chips (real API data) let users narrow instead. Revisit pinning in Phase 6 once vest/áo dài categories exist |
| 2026-07-10 | All Phase 4 filters (category, status, ordering, search) are plain links / a native `<form method="get">` — zero client components | Matches the existing pagination pattern (Phase 3); keeps `/wedding-dresses` a pure Server Component, no JS budget added |
| 2026-07-10 | Extracted `Pagination` into `src/components/shared/Pagination.tsx`, shared by `/collections/[slug]` and `/wedding-dresses` | Avoided duplicating identical DRF prev/next logic across two consumers; zero behavior change to the original |
| 2026-07-10 | `ProductCard` detail links (`/wedding-dresses/[slug]`) intentionally left 404ing | Phase 5 explicitly out of scope this session; matches the project's existing convention of documented, intentional 404s for unshipped routes |
| 2026-07-10 | Product gallery (`ProductGallery`) only mounts as a client component when `images.length > 0`; 0 images renders a static Server-rendered placeholder instead | Keeps the page fully Server-rendered (zero client JS) for today's real data (the only product has 0 images); avoids paying a client-JS cost for a feature with nothing to show yet |
| 2026-07-10 | Gallery grid previews use `object-cover` (cropped, consistent with every other image grid sitewide); the full-screen lightbox uses `object-contain` (true, uncropped image) | No image width/height metadata exists in the API, so per-image "preserve aspect ratio" isn't achievable in a fixed-ratio grid — the lightbox is where an uncropped view actually matters (checking fabric/embroidery detail) |
| 2026-07-10 | Related designs = same-category clothing list, current product excluded client-side by id, capped at 3, section omitted at 0 | No "related products" or "exclude id" backend capability exists; honest derivation from real data only, never fake relationships |
| 2026-07-10 | CTA links pass `?product={slug}` to `/appointment` and `/contact` even though neither route exists yet | Forward-compatible, zero-risk (unused query param until Phase 7 builds the form to read it); explicit instruction to preserve product context without implementing booking mutation this phase |
| 2026-07-10 | Non-`available` status replaces the primary booking CTA with a status message + a link to `/wedding-dresses?status=available` | Satisfies the pre-existing documented rule (API_INTEGRATION.md §5): disable inquiry CTA, suggest alternatives, for unavailable products |

## 19. Current Working Tree Snapshot

**⚠️ Point-in-time snapshot from 2026-07-10 — NON-AUTHORITATIVE. Always rerun Git commands; never trust this section over live output.**

- Branch `main`, remote `origin` connected and tracked, 3 commits pushed (Phases 0–4, HEAD = `b66be0a`, ahead/behind 0/0 as of 2026-07-10).
- Working tree currently **not clean**: Phase 5 (`/wedding-dresses/[slug]`) implemented and verified (`tsc`/`lint`/`build`/`git diff --check` all pass) but uncommitted — modified `src/components/ui/ProductCard.tsx` (exported `STATUS_LABELS`), new `src/app/wedding-dresses/[slug]/page.tsx`, `src/features/clothing/ProductDetail.tsx`, `src/features/clothing/ProductGallery.tsx`. Awaiting review + commit approval.
- FOXIE working tree (separate repo at `D:\LEARN\foxie`) had its own pre-existing local modifications (`CLAUDE.md`, `PackageDetailHero.tsx`, 3 untracked PNGs) — they belong to FOXIE tasks and must never be touched from here. This session read `backend/apps/rentals/{serializers,views,models}.py` **read-only** for API-contract verification only.

## 20. Development Workflow (Claude Code / Fable 5)

Every feature: **DISCOVER → AUDIT → PLAN → APPROVAL → IMPLEMENT → STATIC VERIFY → MANUAL UI REVIEW → COMMIT APPROVAL → CONTROLLED COMMIT → REMOTE SAFETY CHECK → PUSH → DEPLOY VERIFY → PRODUCTION SMOKE TEST → UPDATE PROJECT_STATUS.md → UPDATE CLAUDE.md IF ARCHITECTURE CHANGED.**

- Large features: never jump from request to implementation — inspect code, report findings, propose a plan, wait for approval, then implement.
- Small isolated bug fixes: audit → implement → verify → report (unless the user asks for a planning phase).

## 21. Implementation Safety Rules

1. Never modify FOXIE files while working here.
2. Never change shared backend contracts without explicit approval.
3. Never duplicate backend business logic in the frontend.
4. Never expose secrets.
5. Never hardcode production data.
6. Never invent API fields — inspect serializers/endpoints from source before integration.
7. Always handle: loading, error, empty, partial data, null media, unavailable products.
8. Mobile-first. 9. Accessibility required. 10. SEO required. 11. Performance required.
