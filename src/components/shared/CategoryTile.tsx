import Link from 'next/link'
import type { ApiRentalCategory } from '@/types'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

/**
 * Editorial category tile shared by the homepage discovery grid and the
 * collections index. Categories carry no media field — until real
 * photography exists in the CMS, tiles use a typographic treatment,
 * never fake images.
 */
export function CategoryTile({
  category,
  className,
  large = false,
}: {
  category: ApiRentalCategory
  className?: string
  large?: boolean
}) {
  return (
    <Link
      href={ROUTES.collection(category.slug)}
      className={cn(
        'group relative flex overflow-hidden bg-charcoal text-warm-white',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_25%,rgba(192,160,98,0.16),transparent_60%)] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <span
        aria-hidden
        className="absolute -right-4 -top-8 select-none font-display text-[10rem] font-light italic leading-none text-warm-white/6"
      >
        {category.name.charAt(0).toUpperCase()}
      </span>
      <div aria-hidden className="pointer-events-none absolute inset-3 border border-warm-white/10" />

      <div className="relative mt-auto w-full p-6 md:p-8">
        <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-champagne">
          {category.clothing_count > 0
            ? `${category.clothing_count} thiết kế`
            : 'Bộ sưu tập'}
        </p>
        <h3 className={cn('font-display font-light', large ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl')}>
          {category.name}
        </h3>
        <span className="mt-4 inline-block border-b border-warm-white/40 pb-1 text-[10px] uppercase tracking-[0.28em] text-warm-white/80 transition-colors group-hover:border-champagne group-hover:text-champagne">
          Khám phá
        </span>
      </div>
    </Link>
  )
}
