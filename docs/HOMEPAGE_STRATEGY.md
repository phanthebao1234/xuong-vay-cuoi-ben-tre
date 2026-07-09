# Homepage Strategy — Xưởng Váy Cưới Bến Tre

**Status: implemented 2026-07-09** (`src/features/home/`). Section order is the conversion narrative:
emotion → discovery → trust → action. Every section: mobile-first, one champagne accent max.

## As implemented (deviations from the original 15-section proposal)

The 15 proposed sections were consolidated into 10 with stronger editorial rhythm:

| # | Implemented section | Notes vs proposal |
|---|--------------------|-------------------|
| 1 | `HeroSection` | Full-viewport charcoal composition; transparent Header sits over it (negative-margin integration). CSS editorial treatment until campaign photography exists — swap the background layer for `next/image` then. No carousel/video by design |
| 2 | `BrandManifesto` | Proposal §4, promoted above discovery |
| 3 | `CategoryDiscovery` | Proposal §5+§6+§7 merged — asymmetric grid over real `/rentals/categories/`; adapts to 1 (wide banner), 2+ (primary + secondary tiles); omits itself at 0 |
| 4 | `EditorialStory` | Proposal §8 — static brand copy; no fake "collection" entity |
| 5 | `FeaturedProducts` | Proposal §6/§10 merged — `?is_featured=true&status=available`, max 4 ProductCards, omits when empty (never fake inventory) |
| 6 | `EditorialBreak` | Charcoal typographic band, one link CTA |
| 7 | `WhyChooseUs` | Numbered editorial statements, no icon cards, no invented statistics |
| 8 | `AppointmentProcess` | 3 steps, horizontal desktop / vertical mobile, primary CTA |
| 9 | `LookbookSection` | Proposal §13 — mixed-ratio CSS columns from recent real items; requires ≥ 3 items or omits itself; no Instagram integration |
| 10 | `FinalAppointmentCTA` | Primary CTA + contact link |

Dropped from proposal: announcement bar & header (already global layout), testimonials/bridal stories (no verified testimonials wired yet — candidate for a later phase using the FOXIE testimonials public API), separate new-arrivals row (folded into Lookbook).

Data: fetched once in `src/app/page.tsx` (Server Component, `Promise.all`, per-request `.catch(() => [])`, ISR 300 s) and passed down as props.

## Original proposal (for reference)

| # | Section | Business objective | Visual treatment | API dependency | CTA | Mobile behavior |
|---|---------|-------------------|------------------|----------------|-----|-----------------|
| 1 | Announcement / campaign bar | Promote season campaign, urgency | 1-line charcoal bar, ivory tracked text | none (config) | link to `/collections` | single line, dismissible |
| 2 | Luxury transparent header | Navigation + persistent conversion | transparent over hero → solid ivory on scroll; serif wordmark | none | "Đặt lịch hẹn" button | hamburger → full-screen menu |
| 3 | Full-screen editorial hero | Emotional first impression | full-viewport bridal photo, serif italic headline, slow fade | none for v1 (static asset) | "Khám phá bộ sưu tập" | `100svh`, art-directed portrait crop |
| 4 | Brand statement | Position the atelier ("xưởng" = maker, not reseller) | short centered serif manifesto on cream, hairline rules | none | — | tighter type scale |
| 5 | Featured bridal collections | Route to collections | 2–3 large asymmetric image cards | `/rentals/categories/` | per-collection link | horizontal snap scroll |
| 6 | Wedding dress discovery | Show breadth of dresses | 4–8 ProductCards, portrait grid | `/rentals/clothing/?category=vay-cuoi&status=available` | "Xem tất cả váy cưới" | 2-col grid |
| 7 | Groom suit section | Capture groom segment | editorial split: 1 large image + copy + 2–3 cards | `?category=vest` | "Xem vest cưới" | stacked |
| 8 | Editorial campaign banner | Emotional reset mid-page | full-bleed image, minimal serif overlay | none (static) | optional | shorter crop |
| 9 | Why choose us | Trust & differentiation | 3–4 restrained points (tailoring, fitting, local, price), no icon-grid clichés | none | — | vertical list |
| 10 | New arrivals | Freshness, repeat visits | ProductCard row | `?ordering=-created_at` | "Mẫu mới về" | snap scroll |
| 11 | Rental / appointment process | Reduce friction anxiety | numbered 3–4 steps, hairline connectors | none | "Đặt lịch thử váy" | vertical steps |
| 12 | Real bridal stories | Social proof | large quote in serif italic + photo | FOXIE testimonials API (public) — verify endpoint before wiring | — | single column |
| 13 | Instagram-style gallery | Lifestyle proof, dwell time | tight square mosaic | curated static or clothing images | follow link | 3-col tight grid |
| 14 | Appointment CTA | Primary conversion | charcoal full-width band, serif headline, champagne button, hotline | `POST /leads/submit/` (form on `/appointment`) | "Đặt lịch hẹn tư vấn" | full-width button |
| 15 | Premium footer | SEO + contact + trust | charcoal bg, ivory text, address/hotline/social, local-SEO text block | none (config) | — | accordion columns |
