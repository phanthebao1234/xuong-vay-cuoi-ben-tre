import Link from 'next/link'
import type { ApiRentalCategory } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

/**
 * Asymmetric editorial category grid from real RentalCategory data.
 * Categories carry no media field — until real photography exists in the
 * CMS, tiles use an editorial typographic treatment, not fake images.
 * Renders nothing when no categories exist.
 */
export function CategoryDiscovery({ categories }: { categories: ApiRentalCategory[] }) {
  if (categories.length === 0) return null

  const [primary, ...rest] = categories

  return (
    <Section tone="cream">
      <Container width="wide">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Khám phá"
            title={
              <>
                Dành cho cô dâu, <em className="italic">và cho cả chú rể</em>
              </>
            }
          />
          <Button href={ROUTES.collections} variant="link" className="shrink-0">
            Xem tất cả bộ sưu tập →
          </Button>
        </div>

        <div className={cn('grid gap-4 md:gap-5', rest.length > 0 && 'md:grid-cols-3')}>
          <CategoryTile
            category={primary}
            className={cn(
              'aspect-4/3',
              rest.length > 0 ? 'md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[560px]' : 'md:aspect-21/9',
            )}
            large
          />
          {rest.map((category) => (
            <CategoryTile key={category.id} category={category} className="aspect-4/3" />
          ))}
        </div>
      </Container>
    </Section>
  )
}

function CategoryTile({
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
      {/* Editorial placeholder surface until CMS photography exists */}
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
