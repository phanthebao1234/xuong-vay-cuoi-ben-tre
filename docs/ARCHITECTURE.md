# Architecture — Xưởng Váy Cưới Bến Tre

Status: foundation approved 2026-07-09. See [PROJECT_STATUS.md](PROJECT_STATUS.md) for current phase.

---

## 1. System Position

Xưởng Váy Cưới Bến Tre is an **independent public frontend** that consumes the existing FOXIE Studio backend. It owns no backend, no database, and no admin UI.

```
┌────────────────────────┐      ┌────────────────────────┐
│  FOXIE Studio frontend │      │  Xưởng Váy Cưới BT     │
│  (Vercel, existing)    │      │  (separate Vercel proj)│
│  public site + /admin  │      │  public site only      │
└───────────┬────────────┘      └───────────┬────────────┘
            │                               │  AllowAny endpoints only
            ▼                               ▼
        ┌───────────────────────────────────────┐
        │  FOXIE Django REST API (Railway)      │
        │  /api/v1/ — SHARED, READ-ONLY here    │
        └───────┬───────────────────┬───────────┘
                ▼                   ▼
         PostgreSQL 16       Cloudflare R2 (media CDN)
```

**Decisions (Decision Log in CLAUDE.md §18):**
- Separate folder `D:\LEARN\xuong-vay-cuoi-ben-tre` beside `D:\LEARN\foxie` — no monorepo, no shared node_modules.
- Separate Git repository (initialized 2026-07-09, branch `main`; GitHub remote pending an approved URL).
- Separate Vercel project, separate env vars, separate custom domain (TBD).
- Shared backend / PostgreSQL / R2 / Admin CMS — content is managed in the FOXIE Admin (`/admin/rentals`), this site only reads it.
- Dev server runs on port **3100** to coexist with FOXIE on 3000.

## 2. Architectural Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Shared API contract drift — a FOXIE backend change breaks this site | High | Contract-change protocol in WORKSPACE.md; types verified against serializer source, dated in `src/types/index.ts` |
| Clothing list serializer exposes internal business fields publicly (purchase_price, sold_price, rental_count, retirement_reason) | Medium | This frontend never renders them; fixing the leak is a FOXIE backend decision, logged as a known gap |
| CORS — Railway `CORS_ALLOWED_ORIGINS` will not include the new domain | High (launch blocker) | Requires one FOXIE backend env-var change at deploy time (env var only, no code); needs explicit approval |
| No public rate limiting on `/leads/submit/` & `/bookings/submit/` | Medium | Known FOXIE issue; add client-side debounce + honeypot; backend throttling is a FOXIE task |
| Category taxonomy — "wedding dress / suit / áo dài" depends on `RentalCategory` rows existing in production data | Medium | Route pages resolve by category slug with graceful empty states; seed categories via FOXIE Admin |
| R2 media has no delivery guarantees per-frontend | Low | Absolute CDN URLs; `resolveMediaUrl()` + remotePatterns |

## 3. Frontend Architecture

Same proven conventions as FOXIE, but independent code:

- **Server Components by default.** Public catalog pages fetch server-side via `src/lib/api/*.ts`.
- **No JWT anywhere.** This site consumes AllowAny endpoints only. Admin work happens in FOXIE Admin.
- **ISR over no-store.** Catalog data revalidates (default 300 s) — this site is content, not a dashboard.
- `src/features/*` components receive props only — no fetches inside features.
- All interfaces in `src/types/index.ts`, API types prefixed `Api*`.
- List responses are always paginated `{ count, results }` — normalize with `unwrapResults()`.

## 4. Directory Responsibilities

| Path | Responsibility |
|------|---------------|
| `src/app/` | Routes — data fetching only, pass props to features |
| `src/components/ui` | Primitive presentational components (Button, Badge…) |
| `src/components/layout` | Header, Footer, AnnouncementBar |
| `src/components/shared` | Cross-feature composites (ProductCard, SectionHeading…) |
| `src/features/{home,collections,clothing,rental,appointment,contact}` | Page-level UI sections, props-only |
| `src/lib/api` | `client.ts` (fetch core) + per-domain services |
| `src/lib/config` | `site.ts` — brand constants |
| `src/lib/utils` | `media.ts` and pure helpers |
| `src/lib/constants` | `routes.ts` route map |
| `src/hooks` | Client hooks (only when client interactivity requires) |
| `src/types` | All TypeScript interfaces |
| `docs/` | This handbook set |

## 5. Route Architecture (planned)

| Route | Purpose | Data source | SEO intent | Conversion objective | API dependency |
|-------|---------|-------------|-----------|---------------------|----------------|
| `/` | Editorial brand home | featured clothing + categories | "váy cưới Bến Tre" | appointment CTA | `/rentals/clothing/?is_featured=true`, `/rentals/categories/` |
| `/collections` | Curated collection index | categories | "bộ sưu tập váy cưới" | discovery → detail | `/rentals/categories/` |
| `/collections/[slug]` | One collection grid | clothing by category | collection long-tail | detail → inquiry | `/rentals/clothing/?category={slug}` |
| `/wedding-dresses` | Dress listing + filters | clothing (dress categories) | "thuê váy cưới Bến Tre" | detail → inquiry | same, fixed category slugs |
| `/wedding-dresses/[slug]` | Dress detail | clothing detail | product long-tail | rental inquiry / appointment | `/rentals/clothing/{slug}/` |
| `/suits` · `/suits/[slug]` | Groom suits | clothing (suit category) | "vest cưới Bến Tre" | inquiry | same pattern |
| `/ao-dai` · `/ao-dai/[slug]` | Áo dài cưới | clothing (áo dài category) | "áo dài cưới Bến Tre" | inquiry | same pattern |
| `/rental` | Rental process & pricing explainer | static + categories | "cho thuê váy cưới" | appointment | minimal |
| `/appointment` | Booking / fitting appointment form | form → leads/bookings | "đặt lịch thử váy" | primary conversion | `POST /leads/submit/` or `POST /bookings/submit/` |
| `/about` | Brand story | static | brand queries | trust | none |
| `/contact` | Contact + map + hotline | static + lead form | "studio áo cưới Bến Tre" | inquiry | `POST /leads/submit/` |

`dynamicParams = true` required on all detail pages (CMS-created slugs).

Implemented today: `/` (foundation placeholder only).
