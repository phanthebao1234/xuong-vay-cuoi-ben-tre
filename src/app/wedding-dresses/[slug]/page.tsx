import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchClothingDetail, fetchClothingList } from '@/lib/api/rentals'
import { ApiError } from '@/lib/api/client'
import { buildProductMetadata } from '@/lib/utils/productMetadata'
import { ProductDetail } from '@/features/clothing/ProductDetail'
import type { ApiClothingDetail } from '@/types'

// CMS-created product slugs must resolve at request time
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

interface ProductLookup {
  product: ApiClothingDetail | null
  /** true only when the API itself confirmed the slug doesn't exist (404) */
  confirmedMissing: boolean
}

async function getProduct(slug: string): Promise<ProductLookup> {
  try {
    const product = await fetchClothingDetail(slug)
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
  return buildProductMetadata(product, `/wedding-dresses/${product.slug}`, 'trang phục cưới')
}

export default async function WeddingDressDetailPage({ params }: PageProps) {
  const { slug } = await params
  const { product, confirmedMissing } = await getProduct(slug)

  if (!product && confirmedMissing) notFound()

  const related = product?.category_slug
    ? await fetchClothingList({ category: product.category_slug })
        .then((data) => (data.results ?? []).filter((item) => item.id !== product.id).slice(0, 3))
        .catch(() => [])
    : []

  return <ProductDetail product={product} related={related} />
}
