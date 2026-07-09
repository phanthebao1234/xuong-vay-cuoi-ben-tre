import type { ApiClothingListItem } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Featured designs from the real API (?is_featured=true). Renders nothing
 * when no featured items exist — never fake inventory.
 */
export function FeaturedProducts({ items }: { items: ApiClothingListItem[] }) {
  if (items.length === 0) return null

  const products = items.slice(0, 4)

  return (
    <Section tone="cream">
      <Container width="wide">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Thiết kế nổi bật"
            title={
              <>
                Những lựa chọn <em className="italic">được yêu thích</em>
              </>
            }
          />
          <Button href={ROUTES.weddingDresses} variant="link" className="shrink-0">
            Xem tất cả thiết kế →
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={ROUTES.weddingDress(product.slug)}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
