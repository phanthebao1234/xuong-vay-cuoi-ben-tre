import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/config/site'
import { ROUTES } from '@/lib/constants/routes'
import { SUIT_CATEGORY_SLUG, AO_DAI_CATEGORY_SLUG } from '@/lib/constants/categories'
import { fetchRentalCategories, fetchClothingList } from '@/lib/api/rentals'

const STATIC_PATHS = [
  ROUTES.home,
  ROUTES.collections,
  ROUTES.weddingDresses,
  ROUTES.suits,
  ROUTES.aoDai,
  ROUTES.appointment,
]

/**
 * A product's one true canonical URL, matching its real category — never
 * lists the same slug under more than one route.
 */
function detailPathFor(categorySlug: string | null): (slug: string) => string {
  if (categorySlug === SUIT_CATEGORY_SLUG) return ROUTES.suit
  if (categorySlug === AO_DAI_CATEGORY_SLUG) return ROUTES.aoDaiDetail
  return ROUTES.weddingDress
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
  }))

  // API failure never breaks the sitemap — dynamic entries are best-effort.
  const [categories, clothing] = await Promise.all([
    fetchRentalCategories().catch(() => []),
    fetchClothingList().catch(() => ({ count: 0, next: null, previous: null, results: [] })),
  ])

  const collectionEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE.url}${ROUTES.collection(category.slug)}`,
    lastModified: new Date(category.created_at),
  }))

  const productEntries: MetadataRoute.Sitemap = clothing.results.map((item) => ({
    url: `${SITE.url}${detailPathFor(item.category_slug)(item.slug)}`,
    lastModified: new Date(item.updated_at),
  }))

  return [...staticEntries, ...collectionEntries, ...productEntries]
}
