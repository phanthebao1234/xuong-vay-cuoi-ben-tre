import type { Metadata } from 'next'
import { fetchRentalCategories, fetchClothingList } from '@/lib/api/rentals'
import {
  WeddingDressListing,
  AVAILABLE_STATUS,
  DEFAULT_ORDERING,
  ORDERING_VALUES,
  type OrderingValue,
  type WeddingDressFilters,
} from '@/features/clothing/WeddingDressListing'
import { ROUTES } from '@/lib/constants/routes'
import { SUIT_CATEGORY_SLUG } from '@/lib/constants/categories'

export const metadata: Metadata = {
  title: 'Vest cưới cho thuê tại Bến Tre',
  description:
    'Thuê vest cưới tại Xưởng Váy Cưới Bến Tre — các mẫu vest chú rể được tuyển chọn, đặt lịch thử trực tiếp tại showroom.',
  alternates: { canonical: '/suits' },
}

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; ordering?: string; search?: string }>
}

function isOrderingValue(value: string | undefined): value is OrderingValue {
  return ORDERING_VALUES.includes(value as OrderingValue)
}

export default async function SuitsPage({ searchParams }: PageProps) {
  const raw = await searchParams
  const page = Math.max(1, Number(raw.page) || 1)

  const filters: WeddingDressFilters = {
    category: SUIT_CATEGORY_SLUG,
    status: raw.status === AVAILABLE_STATUS ? AVAILABLE_STATUS : undefined,
    ordering: isOrderingValue(raw.ordering) ? raw.ordering : DEFAULT_ORDERING,
    search: raw.search?.trim() || undefined,
  }

  const categories = await fetchRentalCategories().catch(() => null)
  const categoryExists = categories?.some((c) => c.slug === SUIT_CATEGORY_SLUG) ?? false

  const data =
    categories === null || categoryExists
      ? await fetchClothingList({ ...filters, page }).catch(() => null)
      : { count: 0, next: null, previous: null, results: [] }

  return (
    <WeddingDressListing
      categories={[]}
      data={data}
      filters={filters}
      page={page}
      listingPath={ROUTES.suits}
      detailPath={ROUTES.suit}
      pinnedCategory
      breadcrumbLabel="Vest cưới"
      pageTitle="Vest cưới cho thuê"
      pageDescription="Những mẫu vest chú rể được tuyển chọn tại xưởng — đặt lịch hẹn để thử trực tiếp và nhận tư vấn riêng cho vóc dáng của bạn."
      catalogNoun="vest cưới"
      ctaLabel="Đặt lịch thử vest"
    />
  )
}
