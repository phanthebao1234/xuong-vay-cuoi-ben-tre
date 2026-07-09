import type { Metadata } from 'next'
import { fetchRentalCategories } from '@/lib/api/rentals'
import { CollectionsIndex } from '@/features/collections/CollectionsIndex'

export const metadata: Metadata = {
  title: 'Bộ sưu tập váy cưới, vest cưới & áo dài cưới',
  description:
    'Khám phá các bộ sưu tập trang phục cưới của Xưởng Váy Cưới Bến Tre — váy cưới, vest cưới và áo dài cưới được tuyển chọn cho ngày trọng đại của bạn.',
  alternates: { canonical: '/collections' },
}

export default async function CollectionsPage() {
  // null = API unreachable (degraded state), [] = genuinely empty catalog
  const categories = await fetchRentalCategories().catch(() => null)
  return <CollectionsIndex categories={categories} />
}
