import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Cinematic full-viewport hero. Pulls itself up behind the transparent
 * sticky header (negative top margin matches header height). Charcoal
 * editorial composition until real campaign photography is uploaded —
 * swap the background layer for a next/image when CMS media exists.
 */
export function HeroSection() {
  return (
    <section className="relative -mt-16 flex min-h-svh flex-col justify-center overflow-hidden bg-charcoal text-warm-white md:-mt-20">
      {/* Restrained depth: one soft champagne glow, no busy gradients */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(192,160,98,0.13),transparent_55%)]"
      />
      {/* Atelier frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 border border-warm-white/10 md:inset-8"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-8 md:pb-28 md:pt-36 lg:px-12">
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.4em] text-champagne">
          Xưởng Váy Cưới · Bến Tre
        </p>
        <h1 className="max-w-3xl font-display text-5xl font-light leading-[1.08] md:text-7xl lg:text-8xl">
          Mỗi thiết kế,
          <br />
          một khoảnh khắc
          <br />
          <em className="italic">được nhớ mãi.</em>
        </h1>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-warm-white/65 md:text-base">
          Váy cưới, vest cưới và áo dài cưới được tuyển chọn và chăm chút cho
          ngày trọng đại của bạn — ngay tại Bến Tre.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href={ROUTES.weddingDresses} variant="secondary" size="lg">
            Khám phá váy cưới
          </Button>
          <Link
            href={ROUTES.appointment}
            className="inline-flex items-center justify-center border border-warm-white/40 px-8 py-4 text-xs uppercase tracking-[0.22em] text-warm-white transition-colors duration-300 hover:border-warm-white hover:bg-warm-white hover:text-charcoal"
          >
            Đặt lịch thử váy
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[9px] uppercase tracking-[0.35em] text-warm-white/40">
          Khám phá
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-champagne/70 to-transparent" />
      </div>
    </section>
  )
}
