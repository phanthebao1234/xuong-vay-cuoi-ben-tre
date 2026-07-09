# Roadmap — Xưởng Váy Cưới Bến Tre

Each phase: **objective → deliverables → verification → exit criteria**.
Update [PROJECT_STATUS.md](PROJECT_STATUS.md) when a phase advances.

## Phase 0 — Architecture & API audit ✅ (2026-07-09)
- **Objective:** confirm the site can launch on the existing FOXIE API without backend changes.
- **Deliverables:** capability matrix (API_INTEGRATION.md), architecture decision (ARCHITECTURE.md), project scaffold, handbook set.
- **Verification:** endpoints/permissions read from backend source; `tsc`, `lint`, `build` pass on scaffold.
- **Exit:** foundation created, docs complete. ✅

## Phase 1 — Design system & global shell
- **Objective:** the visual language, live.
- **Deliverables:** tokens finalized; `Button`, `SectionHeading`, `ProductCard`; `Header` (transparent→solid), `Footer`, `AnnouncementBar`; root layout composed.
- **Verification:** static checks + manual review at 375/768/1280; Vietnamese diacritics render in both fonts.
- **Exit:** shell approved on the placeholder homepage.

## Phase 2 — Homepage
- **Objective:** full editorial homepage per HOMEPAGE_STRATEGY.md.
- **Deliverables:** all 15 sections; featured/new-arrival sections live on real API with graceful empty states.
- **Verification:** works with empty production data; Lighthouse mobile ≥ 90 perf.
- **Exit:** homepage approved with real or placeholder-flagged content.

## Phase 3 — Collection discovery
- **Objective:** `/collections` + `/collections/[slug]` from `RentalCategory`.
- **Deliverables:** index, category grid with pagination, empty states.
- **Verification:** unknown slug → 404; empty category → premium empty state.
- **Exit:** navigable discovery flow.

## Phase 4 — Wedding dress listing
- **Objective:** `/wedding-dresses` with supported filters (status, ordering, search).
- **Deliverables:** listing, pagination from `count`, filter UI limited to backend capabilities.
- **Verification:** filter/URL state correct; no invented filters.
- **Exit:** listing usable on production data.

## Phase 5 — Wedding dress detail
- **Objective:** `/wedding-dresses/[slug]` conversion page.
- **Deliverables:** gallery (cover + images), specs (colors/sizes/material/price/code), status handling, inquiry CTA, related items. `dynamicParams = true`.
- **Verification:** null-media & non-available states; internal lifecycle fields never rendered.
- **Exit:** detail page converts to inquiry.

## Phase 6 — Suit & áo dài sections
- **Objective:** reuse listing/detail for `/suits` and `/ao-dai`.
- **Deliverables:** category-pinned routes reusing Phase 4–5 components.
- **Exit:** all three product lines browsable.

## Phase 7 — Rental inquiry & appointment conversion
- **Objective:** `/rental`, `/appointment`, `/contact` with working forms.
- **Deliverables:** verify leads/bookings submit serializers from source, typed payloads, success/error states, honeypot + debounce.
- **Verification:** submissions appear in FOXIE Admin (dev backend).
- **Exit:** end-to-end conversion works.

## Phase 8 — SEO, metadata, structured data
- **Objective:** local SEO for Bến Tre queries.
- **Deliverables:** per-route metadata, OG image, sitemap, robots, JSON-LD (`LocalBusiness`, `Product`), canonical URLs.
- **Verification:** rich-results test; metadata renders per route.
- **Exit:** SEO checklist green.

## Phase 9 — Performance & accessibility
- **Objective:** Core Web Vitals + a11y.
- **Deliverables:** image `sizes` audit, font/JS budget, focus states, contrast, alt text, keyboard nav.
- **Verification:** Lighthouse mobile ≥ 90 perf / ≥ 95 a11y.
- **Exit:** budgets met.

## Phase 10 — Production deployment
- **Objective:** separate Vercel project + domain.
- **Deliverables:** Vercel project, env vars, domain, **CORS_ALLOWED_ORIGINS addition on Railway (explicit approval — only permitted FOXIE-side change, env var only)**.
- **Verification:** production build serves; API calls succeed cross-origin.
- **Exit:** site live.

## Phase 11 — Production smoke test
- **Objective:** verify every route and conversion path in production.
- **Deliverables:** smoke checklist run (routes, images from R2, form submissions, 404s).
- **Exit:** zero P0/P1 findings.

## Phase 12 — Content & conversion optimization
- **Objective:** real catalog content + iteration.
- **Deliverables:** categories + products populated via FOXIE Admin, real photography, copy pass, analytics, CTA iteration.
- **Exit:** ongoing.
