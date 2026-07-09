import Image from 'next/image'
import Link from 'next/link'
import type { ApiClothingListItem, ClothingStatus } from '@/types'
import { resolveMediaUrl } from '@/lib/utils/media'
import { formatPrice } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

/**
 * The exact subset of the verified Clothing list shape this card renders.
 * Internal lifecycle fields (purchase_price, rental_count, …) are deliberately
 * not accepted — they must never reach the public UI.
 */
export type ProductCardData = Pick<
  ApiClothingListItem,
  | 'id'
  | 'name'
  | 'slug'
  | 'code'
  | 'category_name'
  | 'rental_price'
  | 'status'
  | 'is_featured'
  | 'cover_image_url'
>

export const STATUS_LABELS: Partial<Record<ClothingStatus, string>> = {
  reserved: 'Đã được đặt',
  rented: 'Đang cho thuê',
  maintenance: 'Tạm ngưng',
  retired: 'Tạm ngưng',
}

interface ProductCardProps {
  product: ProductCardData
  href: string
  /** Set on above-the-fold cards only */
  priority?: boolean
  /** Match the grid's CSS columns */
  sizes?: string
  className?: string
}

export function ProductCard({
  product,
  href,
  priority = false,
  sizes = '(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw',
  className,
}: ProductCardProps) {
  const imageUrl = resolveMediaUrl(product.cover_image_url)
  const statusLabel = STATUS_LABELS[product.status]

  return (
    <Link href={href} className={cn('group block', className)}>
      <div className="relative aspect-3/4 overflow-hidden bg-cream">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          // Elegant placeholder until real photography is uploaded
          <div
            aria-hidden
            className="flex h-full w-full items-center justify-center bg-gradient-to-b from-cream to-line transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          >
            <span className="font-display text-4xl font-light italic text-taupe/50">
              {product.name.charAt(0).toUpperCase() || 'X'}
            </span>
          </div>
        )}

        {/* Desktop-only discovery overlay — mobile shows all info below the image */}
        <div className="pointer-events-none absolute inset-0 hidden items-end justify-center bg-charcoal/0 pb-6 opacity-0 transition-all duration-500 group-hover:bg-charcoal/25 group-hover:opacity-100 md:flex">
          <span className="border-b border-warm-white/70 pb-1 text-[10px] uppercase tracking-[0.3em] text-warm-white">
            Xem chi tiết
          </span>
        </div>

        {product.is_featured && (
          <span className="absolute left-3 top-3 bg-champagne px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-charcoal">
            Nổi bật
          </span>
        )}
        {statusLabel && (
          <span className="absolute right-3 top-3 bg-charcoal/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-warm-white">
            {statusLabel}
          </span>
        )}
      </div>

      <div className="pt-4">
        {(product.category_name || product.code) && (
          <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-taupe">
            {[product.category_name, product.code].filter(Boolean).join(' · ')}
          </p>
        )}
        <h3 className="font-display text-lg font-normal leading-snug text-charcoal md:text-xl">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-charcoal/80">
          {formatPrice(product.rental_price)}
          <span className="ml-1 text-xs font-normal text-taupe">/ lần thuê</span>
        </p>
      </div>
    </Link>
  )
}
