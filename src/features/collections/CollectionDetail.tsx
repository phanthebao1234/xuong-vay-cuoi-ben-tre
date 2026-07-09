import Link from 'next/link'
import type { ApiPaginated, ApiRentalCategory, ApiClothingListItem } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'
import { Pagination } from '@/components/shared/Pagination'
import { ROUTES } from '@/lib/constants/routes'

interface CollectionDetailProps {
  category: ApiRentalCategory
  /** null → the clothing request failed (API unreachable / invalid page) */
  data: ApiPaginated<ApiClothingListItem> | null
  page: number
}

/** One collection — editorial intro + product grid + prev/next pagination. */
export function CollectionDetail({ category, data, page }: CollectionDetailProps) {
  const items = data?.results ?? []

  return (
    <>
      <Section tone="cream" className="pb-12 md:pb-16">
        <Container>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-taupe">
            <Link href={ROUTES.collections} className="transition-colors hover:text-champagne-deep">
              Bộ sưu tập
            </Link>
            <span aria-hidden className="mx-2 text-champagne">·</span>
            {category.name}
          </p>
          <SectionHeading
            as="h1"
            eyebrow={
              data && data.count > 0 ? `${data.count} thiết kế` : 'Bộ sưu tập'
            }
            title={category.name}
            description={category.description || undefined}
          />
        </Container>
      </Section>

      <Section>
        <Container width="wide">
          {data === null ? (
            <EmptyState
              eyebrow="Tạm thời gián đoạn"
              title={<>Không tải được thiết kế lúc này</>}
              description="Vui lòng thử lại sau ít phút, hoặc đặt lịch hẹn để được tư vấn trực tiếp tại showroom."
              cta={<Button href={ROUTES.appointment} variant="outline">Đặt lịch hẹn</Button>}
            />
          ) : items.length === 0 ? (
            <EmptyState
              eyebrow="Sắp ra mắt"
              title={
                <>
                  Bộ sưu tập <em className="italic">{category.name}</em> đang được chuẩn bị
                </>
              }
              description="Những thiết kế đầu tiên đang trên đường đến showroom. Đặt lịch hẹn để là người đầu tiên trải nghiệm."
              cta={<Button href={ROUTES.appointment} variant="outline">Đặt lịch thử váy</Button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
                {items.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    href={ROUTES.weddingDress(product.slug)}
                    priority={page === 1 && index < 4}
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ))}
              </div>
              <Pagination
                page={page}
                hasPrevious={data.previous !== null}
                hasNext={data.next !== null}
                buildHref={(n) =>
                  n <= 1
                    ? ROUTES.collection(category.slug)
                    : `${ROUTES.collection(category.slug)}?page=${n}`
                }
              />
            </>
          )}
        </Container>
      </Section>
    </>
  )
}
