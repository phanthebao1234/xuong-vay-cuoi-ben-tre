import Link from 'next/link'
import type { ApiClothingDetail, ApiClothingListItem } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductCard, STATUS_LABELS } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProductGallery } from './ProductGallery'
import { ROUTES } from '@/lib/constants/routes'
import { formatPrice } from '@/lib/utils/format'

interface ProductDetailProps {
  /** null = the clothing detail API failed — distinct from an API-confirmed unknown slug (that's a 404, handled by the route) */
  product: ApiClothingDetail | null
  related: ApiClothingListItem[]
}

function Breadcrumb({ product }: { product: ApiClothingDetail | null }) {
  const categoryHref = product?.category_slug
    ? `${ROUTES.weddingDresses}?category=${product.category_slug}`
    : ROUTES.weddingDresses

  return (
    <p className="text-[10px] uppercase tracking-[0.3em] text-taupe">
      <Link href={ROUTES.home} className="transition-colors hover:text-champagne-deep">
        Trang chủ
      </Link>
      <span aria-hidden className="mx-2 text-champagne">·</span>
      <Link href={categoryHref} className="transition-colors hover:text-champagne-deep">
        {product?.category_name ?? 'Váy cưới'}
      </Link>
      {product && (
        <>
          <span aria-hidden className="mx-2 text-champagne">·</span>
          {product.name}
        </>
      )}
    </p>
  )
}

/** Editorial product detail — gallery + info panel + related designs, all from real API data. */
export function ProductDetail({ product, related }: ProductDetailProps) {
  if (!product) {
    return (
      <Section tone="cream" className="min-h-[60vh]">
        <Container width="wide">
          <Breadcrumb product={null} />
          <div className="mt-10">
            <EmptyState
              eyebrow="Tạm thời gián đoạn"
              title={<>Không tải được thông tin thiết kế lúc này</>}
              description="Vui lòng thử lại sau ít phút, hoặc đặt lịch hẹn để được tư vấn trực tiếp tại showroom."
              cta={<Button href={ROUTES.appointment} variant="outline">Đặt lịch hẹn</Button>}
            />
          </div>
        </Container>
      </Section>
    )
  }

  const statusLabel = STATUS_LABELS[product.status]
  const isAvailable = product.status === 'available'
  const hasMaterial = Boolean(product.material.trim())
  const hasSpecs = product.colors.length > 0 || product.sizes.length > 0 || hasMaterial

  return (
    <>
      <Section tone="cream" className="pb-0 pt-8 md:pt-10">
        <Container width="wide">
          <Breadcrumb product={product} />
        </Container>
      </Section>

      <Section tone="cream" className="pt-6 md:pt-8">
        <Container width="wide">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
            <div className="md:col-span-7">
              {product.images.length > 0 ? (
                <ProductGallery images={product.images} productName={product.name} />
              ) : (
                <div className="relative aspect-4/5 bg-gradient-to-b from-cream to-line" aria-hidden>
                  <span className="absolute inset-0 flex items-center justify-center font-display text-7xl font-light italic text-taupe/40">
                    {product.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-5">
              <div className="md:sticky md:top-28">
                {(product.category_name || product.code) && (
                  <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-taupe">
                    {[product.category_name, product.code].filter(Boolean).join(' · ')}
                  </p>
                )}
                <h1 className="font-display text-3xl font-light leading-[1.15] text-charcoal md:text-5xl">
                  {product.name}
                </h1>

                <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <p className="text-xl font-medium text-charcoal">
                    {formatPrice(product.rental_price)}
                    <span className="ml-1.5 text-sm font-normal text-taupe">/ lần thuê</span>
                  </p>
                  {product.sale_price !== null && (
                    <p className="text-sm text-taupe">
                      Giá bán: <span className="text-charcoal">{formatPrice(product.sale_price)}</span>
                    </p>
                  )}
                </div>

                {statusLabel && (
                  <p className="mt-4 inline-block border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-taupe">
                    {statusLabel}
                  </p>
                )}

                {product.description && (
                  <p className="mt-6 text-sm leading-relaxed text-taupe">{product.description}</p>
                )}

                {hasSpecs && (
                  <dl className="mt-8 space-y-3 border-t border-line pt-6">
                    {hasMaterial && (
                      <div className="flex justify-between gap-4 text-sm">
                        <dt className="text-taupe">Chất liệu</dt>
                        <dd className="text-right text-charcoal">{product.material}</dd>
                      </div>
                    )}
                    {product.colors.length > 0 && (
                      <div className="flex justify-between gap-4 text-sm">
                        <dt className="text-taupe">Màu sắc</dt>
                        <dd className="text-right text-charcoal">{product.colors.join(', ')}</dd>
                      </div>
                    )}
                    {product.sizes.length > 0 && (
                      <div className="flex justify-between gap-4 text-sm">
                        <dt className="text-taupe">Kích thước</dt>
                        <dd className="text-right text-charcoal">{product.sizes.join(', ')}</dd>
                      </div>
                    )}
                  </dl>
                )}

                <div className="mt-8 space-y-3 border-t border-line pt-8">
                  {isAvailable ? (
                    <Button
                      href={`${ROUTES.appointment}?product=${product.slug}`}
                      variant="primary"
                      className="w-full justify-center"
                    >
                      Đặt lịch thử váy
                    </Button>
                  ) : (
                    <>
                      <p className="text-sm text-taupe">
                        Thiết kế này hiện tạm thời không thể đặt lịch thử trực tiếp.
                      </p>
                      <Button
                        href={`${ROUTES.weddingDresses}?status=available`}
                        variant="primary"
                        className="w-full justify-center"
                      >
                        Xem thiết kế còn trống
                      </Button>
                    </>
                  )}
                  <Button
                    href={`${ROUTES.contact}?product=${product.slug}`}
                    variant="outline"
                    className="w-full justify-center"
                  >
                    Liên hệ tư vấn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section>
          <Container width="wide">
            <SectionHeading
              eyebrow="Có thể bạn sẽ thích"
              title="Thiết kế liên quan"
              className="mb-12 md:mb-16"
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  href={ROUTES.weddingDress(item.slug)}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
