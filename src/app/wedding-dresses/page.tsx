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

export const metadata: Metadata = {
  title: 'Váy cưới cho thuê tại Bến Tre',
  description:
    'Thuê váy cưới tại Xưởng Váy Cưới Bến Tre — các mẫu váy cưới được tuyển chọn, đặt lịch thử trực tiếp tại showroom và nhận tư vấn riêng.',
  alternates: { canonical: '/wedding-dresses' },
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    status?: string
    ordering?: string
    search?: string
  }>
}

function isOrderingValue(value: string | undefined): value is OrderingValue {
  return ORDERING_VALUES.includes(value as OrderingValue)
}

export default async function WeddingDressesPage({ searchParams }: PageProps) {
  const raw = await searchParams
  const page = Math.max(1, Number(raw.page) || 1)

  const filters: WeddingDressFilters = {
    category: raw.category || undefined,
    status: raw.status === AVAILABLE_STATUS ? AVAILABLE_STATUS : undefined,
    ordering: isOrderingValue(raw.ordering) ? raw.ordering : DEFAULT_ORDERING,
    search: raw.search?.trim() || undefined,
  }

  const [categories, data] = await Promise.all([
    fetchRentalCategories().catch(() => null),
    fetchClothingList({ ...filters, page }).catch(() => null),
  ])

  return <WeddingDressListing categories={categories} data={data} filters={filters} page={page} />
}
