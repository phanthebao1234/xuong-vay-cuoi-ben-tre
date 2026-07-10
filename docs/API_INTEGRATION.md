# API Integration — Xưởng Váy Cưới Bến Tre

All backend capability claims below were **verified against FOXIE backend source on 2026-07-09**
(`backend/apps/rentals/{models,serializers,views,urls}.py`, `backend/core/urls.py`).
Re-verify before relying on anything here — the backend is owned by FOXIE and may change.

---

## 1. Base URL

```
dev:  http://localhost:8000/api/v1
prod: https://foxie-production.up.railway.app/api/v1
```

Configured via `NEXT_PUBLIC_API_URL` (origin only, `/api/v1` appended in `src/lib/api/client.ts`).

## 2. API Capability Matrix (rentals domain)

| Feature | Backend Support | API Endpoint | Serializer | Frontend Ready | Gap | Recommendation |
|---------|----------------|--------------|-----------|----------------|-----|----------------|
| Clothing categories | ✅ `RentalCategory` | `GET /rentals/categories/` (AllowAny) | `RentalCategorySerializer` | ✅ typed | No cover image / hero media on category | Curate collection imagery frontend-side or via FOXIE homepage CMS |
| Wedding dresses | ✅ via category rows | `GET /rentals/clothing/?category={slug}` | `ClothingListSerializer` | ✅ typed | No product-type enum — taxonomy depends on production `RentalCategory` data | Create categories (váy cưới, vest, áo dài…) in FOXIE Admin; pin slugs in config |
| Suits | ✅ same mechanism | same | same | ✅ | same as above | same |
| Áo dài | ✅ same mechanism | same | same | ✅ | same as above | same |
| Product images | ✅ `ClothingImage` (multi, cover, sort) | nested in detail; `cover_image_url` in list | `ClothingImageSerializer` | ✅ typed | none | use `thumbnail_url` in grids when present |
| Product codes | ✅ `code` unique | list + detail | ✅ | ✅ | none | display as SKU |
| Colors | ✅ `colors` JSON list | list + detail | ✅ | ✅ | **no server-side filter** (JSONField, not in filterset) | filter client-side within fetched page, or accept gap for v1 |
| Sizes | ✅ `sizes` JSON list | list + detail | ✅ | ✅ | **no server-side filter** | same as colors |
| Materials | ✅ `material` char | list + detail | ✅ | ✅ | no filter | display only for v1 |
| Rental prices | ✅ `rental_price` int (VND) | list + detail | ✅ | ✅ | no price-range filter; `ordering=rental_price` works | sort by price; range filter client-side |
| Availability status | ✅ 5-state `status` | list + detail; `?status=available` filter | ✅ | ✅ | no date-based availability calendar | show status badge; real availability handled at consultation |
| Descriptions | ✅ `description` text | detail only (not in list) | ✅ | ✅ | plain text, no rich text | fine for v1 |
| Featured products | ✅ `is_featured` bool | `?is_featured=true` filter | ✅ | ✅ | none | powers homepage sections |
| Collections (curated) | ⚠️ only `RentalCategory` | — | — | — | no separate "collection" entity (season/campaign) | map collections 1:1 to categories for v1 |
| Filtering | ✅ `status`, `is_featured`, `category` (slug) | DjangoFilterBackend + custom | — | ✅ | no color/size/price-range | v1 ships with supported filters only |
| Search | ✅ `?search=` on name/code/description | SearchFilter | — | ✅ | Vietnamese diacritics — DB collation dependent | expose simple search box, verify behavior against prod |
| Pagination | ✅ global DRF pagination | `{ count, next, previous, results }` | — | ✅ | page size fixed by backend | build numbered pagination from `count` |
| Rental inquiry | ✅ leads | `POST /leads/submit/` (AllowAny) | `LeadPublicSerializer` | ✅ wired 2026-07-10 (`/appointment`) | no throttling (known FOXIE issue); **this origin isn't yet in `CORS_ALLOWED_ORIGINS`, verified empirically — direct browser POST fails CORS**, worked around via same-origin `src/app/api/appointment/route.ts` server-side proxy | selected over bookings — only `name` required, no forced `booking_date`/photography-only `service_type` enum |
| Appointment booking | ✅ bookings | `POST /bookings/submit/` (AllowAny) | `BookingPublicSerializer` | ⚠️ not used | requires `phone`, `booking_date`, and a photography-studio `service_type` enum (wedding/pre_wedding/family/…/rental) — poor fit for a dress-fitting inquiry; `rental` is the only relevant choice | not selected for `/appointment`; revisit only if true date/time scheduling is needed |
| Accessories | ✅ public list/detail | `GET /rentals/accessories/` | `AccessoryListSerializer` | ✅ typed | — | optional "phụ kiện" section later |

**Verdict: the site can launch on the existing API with zero backend changes**, provided:
1. `RentalCategory` rows for váy cưới / vest / áo dài exist in production (content task, FOXIE Admin).
2. The new domain (and this dev origin, for local testing against prod) is added to `CORS_ALLOWED_ORIGINS` on Railway (env var, approval required) — **confirmed missing today** (empirical probe 2026-07-10: `OPTIONS`/`POST` to `/leads/submit/` from `Origin: http://localhost:3100` returns no `Access-Control-Allow-Origin` header). Until then, all client-side POSTs must route through this app's own `/api/*` proxy routes, never call FOXIE directly from the browser.

### ⚠️ Public data-exposure note (FOXIE backend gap, do not fix from this project)
`ClothingListSerializer` and `ClothingDetailSerializer` expose internal lifecycle fields to
the public: `purchase_date`, `purchase_price`, `sold_price`, `rental_count`, `retirement_reason`,
`quantity`. **This frontend must never render them.** Recommend FOXIE adds a trimmed public
serializer eventually — requires cross-project approval.

## 3. Client Strategy

- `src/lib/api/client.ts` — single `apiFetch<T>()` with **ISR revalidation (default 300 s)** instead of FOXIE's `no-store` (this site is a content catalog, not an admin dashboard). `ApiError` carries HTTP status.
- `src/lib/api/rentals.ts` — typed per-domain services; pages call services, never `fetch` directly.
- `src/lib/api/leads.ts` — client-callable `submitLead()`, posts to this app's own `/api/appointment` route (same-origin), never directly to FOXIE from the browser (see CORS note above). The route handler (`src/app/api/appointment/route.ts`) is a thin server-side relay — forwards the exact payload to `POST /leads/submit/` and relays FOXIE's exact status/body back, no rewriting.
- **No JWT code exists in this repo by design.** Any task that seems to need auth belongs in the FOXIE Admin instead.
- Server-side fetching by default; client-side fetching only for interactive filtering or form submission (`AppointmentForm`, the only client component in the conversion flow).

## 4. Media Handling

- Always pass URLs through `resolveMediaUrl()` (`src/lib/utils/media.ts`) before `<Image>`.
- Dev: strips `http://localhost:8000` → `/media/...` → rewrite proxy in `next.config.ts`.
- Prod: R2 absolute URLs pass through; R2 host allowed in `remotePatterns` (every entry needs explicit `pathname: '/**'`).
- `blob:` preview URLs (if ever used) → plain `<img>`, never `<Image>`.

## 5. Required UI States

Every data-driven view must handle: **loading** (skeleton), **error** (`.catch` → fallback + quiet log, never blank page), **empty** (premium empty state, no lorem), **partial data** (missing `cover_image_url` → styled placeholder; empty `colors`/`sizes` → omit row), **unavailable product** (`status !== 'available'` → badge, disable inquiry CTA, suggest alternatives).

Pattern for public pages: `const data = await fetchX().catch(() => fallback)`.
