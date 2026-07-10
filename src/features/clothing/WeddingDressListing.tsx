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
import { cn } from '@/lib/utils/cn'

/** The only status value exposed as a public filter — hides non-available inventory. */
export const AVAILABLE_STATUS = 'available'

export const ORDERING_OPTIONS = [
  { value: '-created_at', label: 'Mới nhất' },
  { value: 'rental_price', label: 'Giá thấp đến cao' },
  { value: '-rental_price', label: 'Giá cao đến thấp' },
  { value: 'name', label: 'Tên A-Z' },
] as const

export type OrderingValue = (typeof ORDERING_OPTIONS)[number]['value']
export const ORDERING_VALUES = ORDERING_OPTIONS.map((o) => o.value) as OrderingValue[]
export const DEFAULT_ORDERING: OrderingValue = '-created_at'

export interface WeddingDressFilters {
  category?: string
  status?: string
  ordering: OrderingValue
  search?: string
}

interface WeddingDressListingProps {
  /** null = categories API unreachable — category filter row is omitted, not faked */
  categories: ApiRentalCategory[] | null
  /** null = clothing API unreachable — distinct from a genuinely empty result set */
  data: ApiPaginated<ApiClothingListItem> | null
  filters: WeddingDressFilters
  page: number
  /** Route configuration — defaults preserve exact /wedding-dresses behavior */
  listingPath?: string
  detailPath?: (slug: string) => string
  /** true for category-pinned routes (/suits, /ao-dai) — hides the category-chip row */
  pinnedCategory?: boolean
  breadcrumbLabel?: string
  pageTitle?: string
  pageDescription?: string
  /** Vietnamese noun used in empty-state copy, e.g. "váy cưới" / "vest cưới" / "áo dài cưới" */
  catalogNoun?: string
  ctaLabel?: string
}

function buildHref(
  listingPath: string,
  filters: WeddingDressFilters,
  overrides: Partial<WeddingDressFilters & { page: number }> = {},
): string {
  const merged = { ...filters, ...overrides }
  const qs = new URLSearchParams()
  if (merged.category) qs.set('category', merged.category)
  if (merged.status) qs.set('status', merged.status)
  if (merged.ordering !== DEFAULT_ORDERING) qs.set('ordering', merged.ordering)
  if (merged.search) qs.set('search', merged.search)
  if ('page' in overrides && overrides.page && overrides.page > 1) {
    qs.set('page', String(overrides.page))
  }
  const qsStr = qs.toString()
  return qsStr ? `${listingPath}?${qsStr}` : listingPath
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'border-b pb-1 text-[10px] uppercase tracking-[0.25em] transition-colors',
        active
          ? 'border-champagne text-charcoal'
          : 'border-transparent text-taupe hover:border-champagne/50 hover:text-charcoal',
      )}
    >
      {children}
    </Link>
  )
}

/** Editorial clothing listing — real API data, filters limited to backend capabilities. Reused by /wedding-dresses, /suits, /ao-dai. */
export function WeddingDressListing({
  categories,
  data,
  filters,
  page,
  listingPath = ROUTES.weddingDresses,
  detailPath = ROUTES.weddingDress,
  pinnedCategory = false,
  breadcrumbLabel = 'Váy cưới',
  pageTitle = 'Váy cưới cho thuê',
  pageDescription = 'Những mẫu váy cưới được tuyển chọn tại xưởng — đặt lịch hẹn để thử trực tiếp và nhận tư vấn riêng cho dáng vóc của bạn.',
  catalogNoun = 'váy cưới',
  ctaLabel = 'Đặt lịch thử váy',
}: WeddingDressListingProps) {
  const items = data?.results ?? []
  const visibleCategories = categories ?? []
  const hasActiveFilters = Boolean((filters.category && !pinnedCategory) || filters.status || filters.search)
  const showCategoryChips = !pinnedCategory && visibleCategories.length > 0
  const showFilterBar = pinnedCategory || visibleCategories.length > 0

  return (
    <>
      <Section tone="cream" className="pb-12 md:pb-16">
        <Container>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-taupe">
            <Link href={ROUTES.home} className="transition-colors hover:text-champagne-deep">
              Trang chủ
            </Link>
            <span aria-hidden className="mx-2 text-champagne">·</span>
            {breadcrumbLabel}
          </p>
          <SectionHeading
            as="h1"
            eyebrow={data && data.count > 0 ? `${data.count} thiết kế` : breadcrumbLabel}
            title={pageTitle}
            description={pageDescription}
          />
        </Container>
      </Section>

      <Section>
        <Container width="wide">
          {data === null ? (
            <EmptyState
              eyebrow="Tạm thời gián đoạn"
              title={<>Không tải được danh sách thiết kế lúc này</>}
              description="Vui lòng thử lại sau ít phút, hoặc đặt lịch hẹn để được tư vấn trực tiếp tại showroom."
              cta={<Button href={ROUTES.appointment} variant="outline">Đặt lịch hẹn</Button>}
            />
          ) : (
            <>
              {showFilterBar && (
                <div className="mb-10 flex flex-col gap-6 border-b border-line pb-8 md:mb-12">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {showCategoryChips && (
                      <>
                        <FilterChip href={buildHref(listingPath, filters, { category: undefined })} active={!filters.category}>
                          Tất cả
                        </FilterChip>
                        {visibleCategories.map((category) => (
                          <FilterChip
                            key={category.id}
                            href={buildHref(listingPath, filters, { category: category.slug })}
                            active={filters.category === category.slug}
                          >
                            {category.name}
                          </FilterChip>
                        ))}
                        <span aria-hidden className="h-3 w-px bg-line" />
                      </>
                    )}
                    <FilterChip
                      href={buildHref(listingPath, filters, {
                        status: filters.status ? undefined : AVAILABLE_STATUS,
                      })}
                      active={filters.status === AVAILABLE_STATUS}
                    >
                      Chỉ hiện thiết kế còn trống
                    </FilterChip>
                  </div>

                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      {ORDERING_OPTIONS.map((option) => (
                        <FilterChip
                          key={option.value}
                          href={buildHref(listingPath, filters, { ordering: option.value })}
                          active={filters.ordering === option.value}
                        >
                          {option.label}
                        </FilterChip>
                      ))}
                    </div>

                    <form method="get" action={listingPath} className="flex items-center gap-3">
                      {filters.category && <input type="hidden" name="category" value={filters.category} />}
                      {filters.status && <input type="hidden" name="status" value={filters.status} />}
                      {filters.ordering !== DEFAULT_ORDERING && (
                        <input type="hidden" name="ordering" value={filters.ordering} />
                      )}
                      <label htmlFor="wedding-dress-search" className="sr-only">
                        Tìm kiếm theo tên hoặc mã thiết kế
                      </label>
                      <input
                        id="wedding-dress-search"
                        type="search"
                        name="search"
                        defaultValue={filters.search ?? ''}
                        placeholder="Tìm theo tên hoặc mã thiết kế…"
                        className="w-full min-w-0 border-b border-line bg-transparent py-2 text-sm text-charcoal placeholder:text-taupe/70 focus:border-champagne focus:outline-none md:w-64"
                      />
                      <button
                        type="submit"
                        className="shrink-0 border-b border-champagne/60 pb-1 text-[10px] uppercase tracking-[0.25em] text-charcoal transition-colors hover:border-champagne hover:text-champagne-deep"
                      >
                        Tìm
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                hasActiveFilters ? (
                  <EmptyState
                    eyebrow="Không có kết quả"
                    title={<>Không tìm thấy thiết kế phù hợp</>}
                    description={`Vui lòng thử tiêu chí khác, hoặc xem toàn bộ ${catalogNoun} hiện có tại xưởng.`}
                    cta={<Button href={listingPath} variant="outline">Xem tất cả {catalogNoun}</Button>}
                  />
                ) : (
                  <EmptyState
                    eyebrow="Sắp ra mắt"
                    title={
                      <>
                        Bộ sưu tập {catalogNoun} đang được <em className="italic">chuẩn bị</em>
                      </>
                    }
                    description="Những thiết kế đầu tiên đang trên đường đến showroom. Đặt lịch hẹn để là người đầu tiên trải nghiệm."
                    cta={<Button href={ROUTES.appointment} variant="outline">{ctaLabel}</Button>}
                  />
                )
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
                    {items.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        href={detailPath(product.slug)}
                        priority={page === 1 && index < 4}
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ))}
                  </div>
                  <Pagination
                    page={page}
                    hasPrevious={data.previous !== null}
                    hasNext={data.next !== null}
                    buildHref={(n) => buildHref(listingPath, filters, { page: n })}
                  />
                </>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  )
}
