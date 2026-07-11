import type { Metadata } from 'next'
import type { ApiClothingDetail } from '@/types'
import { resolveMediaUrl } from '@/lib/utils/media'

/**
 * Shared generateMetadata builder for the three product-detail routes
 * (/wedding-dresses/[slug], /suits/[slug], /ao-dai/[slug]) — identical
 * logic previously duplicated three times.
 *
 * Falls back to the site's branded /opengraph-image when the product has
 * no photos. A route-level `openGraph` object with no `images` key
 * suppresses inheritance of the root's file-convention OG image entirely,
 * so the fallback must be set explicitly here rather than omitted.
 */
export function buildProductMetadata(
  product: ApiClothingDetail,
  canonicalPath: string,
  categoryFallbackLabel: string,
): Metadata {
  const description = product.description
    ? product.description.slice(0, 160)
    : `${product.name} — thiết kế ${product.category_name ?? categoryFallbackLabel} tại Xưởng Váy Cưới Bến Tre. Đặt lịch thử trực tiếp tại showroom.`

  const cover = product.images.find((img) => img.is_cover) ?? product.images[0]
  const imageUrl = cover ? resolveMediaUrl(cover.file_url) : '/opengraph-image'

  return {
    title: product.name,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      images: [{ url: imageUrl }],
    },
  }
}
