# Design System — Xưởng Váy Cưới Bến Tre

**Brand:** Xưởng Váy Cưới Bến Tre
**Style:** Luxury Editorial Bridal Fashion — image-first, emotional, conversion-focused, mobile-first.

Reference `aocuoivivian.com` informs **information architecture and commercial flow only**.
This brand has its own visual identity — never clone the reference's look, text, or imagery.
It must also read distinctly from FOXIE Studio (different serif, cooler ivory, quieter gold).

---

## 1. Color Tokens (defined in `src/app/globals.css` `@theme`)

| Token | Hex | Usage |
|-------|-----|-------|
| `ivory` | `#FBF9F4` | Primary page background |
| `warm-white` | `#FFFDF9` | Cards, elevated surfaces, text on dark |
| `cream` | `#F3EEE5` | Alternating section background |
| `champagne` | `#C0A062` | Accent — CTAs, hairline rules, active states. **Restrained**: never large fills |
| `champagne-deep` | `#A8874C` | Accent hover/pressed |
| `charcoal` | `#2A2523` | Primary text; dark editorial sections |
| `taupe` | `#9C8E80` | Secondary text, captions, product metadata |
| `line` | `#E9E2D6` | Hairline borders on light surfaces |

Rules: use Tailwind theme classes (`bg-ivory`, `text-taupe`, `border-line`) — no raw hex in components. Do not reuse FOXIE's `#B88A44`.

## 2. Typography

| Role | Font | Classes |
|------|------|---------|
| Display / editorial headlines / collection names | **Cormorant Garamond** (serif, Vietnamese subset) | `font-display font-light italic` for emotional lines; roman for structural titles |
| Body / nav / forms / buttons / product metadata | **Be Vietnam Pro** (sans, native Vietnamese) | `font-body`; buttons & eyebrows: `text-xs uppercase tracking-[0.25em]`+ |

Scale: hero `text-5xl md:text-7xl font-light`; section title `text-3xl md:text-5xl`; eyebrow above titles in tracked uppercase taupe; body `text-sm md:text-base leading-relaxed`. Prices in `font-body font-medium`, never bold-shouty.

## 3. Principles

- **Image-first** — photography carries the page; UI recedes. Portrait `aspect-[3/4]` product imagery.
- **Generous whitespace** — `py-20 md:py-32` sections; never cram.
- **Strong editorial hierarchy** — eyebrow → display headline → short lede → imagery.
- **Asymmetric layouts** where appropriate (offset editorial pairs), grids stay calm.
- **Subtle motion** — fade/rise on scroll only, ~0.7 s ease-out, `once: true`. No parallax carnivals.
- **Restrained gold** — champagne appears in hairlines, small CTAs, one accent per viewport.
- **Minimal radius** — sharp or `rounded-sm`; bridal fashion, not SaaS.
- **Mobile-first, conversion-focused** — sticky/simple appointment CTA reachable at all times.

## 4. Avoid

Excessive gradients · glassmorphism · generic SaaS cards · heavy rounded corners · saturated/cheap gold (`#FFD700`-anything) · animation noise · template-ecommerce look (badge clutter, discount stickers, star-rating spam).

## 5. Implemented Components (Phase 1, 2026-07-09)

| Component | File | Rules |
|-----------|------|-------|
| `Button` | `src/components/ui/Button.tsx` | Variants `primary` (charcoal), `secondary` (champagne), `outline`, `ghost`, `link` (hairline-underline editorial); sizes `sm/md/lg`; uppercase `tracking-[0.22em]`; `rounded-sm`; renders `<Link>` when `href` given, else `<button type="button">`; disabled = `opacity-40` |
| `SectionHeading` | `src/components/ui/SectionHeading.tsx` | eyebrow (tracked taupe/champagne) → serif title (`text-3xl md:text-5xl font-light`) → taupe lede → optional CTA; `align` left/center; `as` h1–h3; `onDark` for charcoal sections |
| `ProductCard` | `src/components/ui/ProductCard.tsx` | Accepts only the public-safe `ProductCardData` subset of `ApiClothingListItem`; `aspect-3/4` image via `resolveMediaUrl`; null image → cream-gradient serif-initial placeholder; hover (desktop only): 1.04 scale + charcoal overlay + "Xem chi tiết"; badges: featured (champagne), non-available status (charcoal); all essentials visible without hover on mobile |
| `Container` | `src/components/layout/Container.tsx` | `px-5 sm:px-8 lg:px-12`; `max-w-6xl` default, `max-w-7xl` (`width="wide"`) for image grids |
| `Section` | `src/components/layout/Section.tsx` | `py-16 md:py-24 lg:py-28`; tones `ivory / cream / dark` |
| `AnnouncementBar` | `src/components/layout/AnnouncementBar.tsx` | Single-line charcoal bar, tracked ivory text, links to `/appointment`, no animation |
| `Header` | `src/components/layout/Header.tsx` | Client component. Sticky; desktop 3-column grid (nav · brand · CTA); `variant='solid'` (default) or `'transparent'` (over dark hero, solidifies after 24 px scroll — reserved for Phase 2). Mobile: hamburger → full-screen charcoal menu, numbered serif links, champagne active state, appointment CTA; Escape close, body scroll lock, closes on route change |
| `Footer` | `src/components/layout/Footer.tsx` | Charcoal; serif brand statement + champagne CTA; columns Khám phá / Dịch vụ / Liên hệ; tracked copyright |

Motion: CSS transitions only (300–700 ms ease-out) — no animation library. Global `:focus-visible` champagne ring and `prefers-reduced-motion` handling live in `globals.css`.
