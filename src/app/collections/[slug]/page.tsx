import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchRentalCategories, fetchClothingList } from '@/lib/api/rentals'
import { CollectionDetail } from '@/features/collections/CollectionDetail'

// CMS-created category slugs must resolve at request time
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

/**
 * Categories have no slug-retrieve endpoint (UUID lookup only), so the
 * slug resolves through the cached list — one memoized fetch serves both
 * generateMetadata and the page.
 */
async function findCategory(slug: string) {
  const categories = await fetchRentalCategories().catch(() => null)
  return {
    categories,
    category: categories?.find((c) => c.slug === slug) ?? null,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { category } = await findCategory(slug)
  if (!category) return { title: 'Không tìm thấy bộ sưu tập', robots: { index: false } }
  return {
    title: `${category.name} — Bộ sưu tập`,
    description:
      category.description ||
      `Bộ sưu tập ${category.name} tại Xưởng Váy Cưới Bến Tre — đặt lịch thử trang phục riêng tư tại showroom.`,
    alternates: { canonical: `/collections/${category.slug}` },
  }
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const [{ slug }, { page: rawPage }] = await Promise.all([params, searchParams])
  const page = Math.max(1, Number(rawPage) || 1)

  const { categories, category } = await findCategory(slug)
  const data = await fetchClothingList({ category: slug, page }).catch(() => null)

  if (categories === null) {
    // API unreachable — degraded editorial state rather than a misleading 404
    return (
      <CollectionDetail
        category={{
          id: slug,
          name: 'Bộ sưu tập',
          slug,
          description: '',
          sort_order: 0,
          clothing_count: 0,
          created_at: '',
        }}
        data={data}
        page={page}
      />
    )
  }

  // API reachable but slug unknown → real 404
  if (!category) notFound()

  return <CollectionDetail category={category} data={data} page={page} />
}
