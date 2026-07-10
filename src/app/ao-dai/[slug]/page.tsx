import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchClothingDetail, fetchClothingList } from '@/lib/api/rentals'
import { ApiError } from '@/lib/api/client'
import { resolveMediaUrl } from '@/lib/utils/media'
import { ProductDetail } from '@/features/clothing/ProductDetail'
import { ROUTES } from '@/lib/constants/routes'
import { AO_DAI_CATEGORY_SLUG } from '@/lib/constants/categories'
import type { ApiClothingDetail } from '@/types'

export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

interface ProductLookup {
  product: ApiClothingDetail | null
  /** true when the API confirmed the slug doesn't exist, OR it exists under a different category */
  confirmedMissing: boolean
}

async function getProduct(slug: string): Promise<ProductLookup> {
  try {
    const product = await fetchClothingDetail(slug)
    // A valid product from another category must not silently render under /ao-dai.
    if (product.category_slug !== AO_DAI_CATEGORY_SLUG) {
      return { product: null, confirmedMissing: true }
    }
    return { product, confirmedMissing: false }
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { product: null, confirmedMissing: true }
    }
    return { product: null, confirmedMissing: false }
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { product } = await getProduct(slug)
  if (!product) return { title: 'Không tìm thấy thiết kế', robots: { index: false } }

  const description = product.description
    ? product.description.slice(0, 160)
    : `${product.name} — thiết kế ${product.category_name ?? 'áo dài cưới'} tại Xưởng Váy Cưới Bến Tre. Đặt lịch thử trực tiếp tại showroom.`

  const cover = product.images.find((img) => img.is_cover) ?? product.images[0]

  return {
    title: product.name,
    description,
    alternates: { canonical: `/ao-dai/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      ...(cover ? { images: [{ url: resolveMediaUrl(cover.file_url) }] } : {}),
    },
  }
}

export default async function AoDaiDetailPage({ params }: PageProps) {
  const { slug } = await params
  const { product, confirmedMissing } = await getProduct(slug)

  if (!product && confirmedMissing) notFound()

  const related = product?.category_slug
    ? await fetchClothingList({ category: product.category_slug })
        .then((data) => (data.results ?? []).filter((item) => item.id !== product.id).slice(0, 3))
        .catch(() => [])
    : []

  return (
    <ProductDetail
      product={product}
      related={related}
      listingPath={ROUTES.aoDai}
      detailPath={ROUTES.aoDaiDetail}
      breadcrumbFallbackLabel="Áo dài cưới"
      ctaLabel="Đặt lịch thử áo dài"
    />
  )
}
