import type { ApiRentalCategory } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { CategoryTile } from '@/components/shared/CategoryTile'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

/**
 * Asymmetric editorial category grid from real RentalCategory data.
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
