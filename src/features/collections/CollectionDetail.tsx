import Link from 'next/link'
import type { ApiPaginated, ApiRentalCategory, ApiClothingListItem } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

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
                basePath={ROUTES.collection(category.slug)}
                page={page}
                hasPrevious={data.previous !== null}
                hasNext={data.next !== null}
              />
            </>
          )}
        </Container>
      </Section>
    </>
  )
}

function Pagination({
  basePath,
  page,
  hasPrevious,
  hasNext,
}: {
  basePath: string
  page: number
  hasPrevious: boolean
  hasNext: boolean
}) {
  if (!hasPrevious && !hasNext) return null

  const pageHref = (n: number) => (n <= 1 ? basePath : `${basePath}?page=${n}`)
  const linkClasses =
    'inline-flex items-center gap-2 border-b border-champagne/60 pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors hover:border-champagne hover:text-champagne-deep'

  return (
    <nav aria-label="Phân trang" className="mt-14 flex items-center justify-between border-t border-line pt-8">
      {hasPrevious ? (
        <Link href={pageHref(page - 1)} className={linkClasses}>
          ← Trang trước
        </Link>
      ) : (
        <span aria-hidden />
      )}
      <span className="text-[10px] uppercase tracking-[0.3em] text-taupe">Trang {page}</span>
      {hasNext ? (
        <Link href={pageHref(page + 1)} className={cn(linkClasses, 'text-right')}>
          Trang sau →
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  )
}
