'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { ApiClothingImage } from '@/types'
import { resolveMediaUrl } from '@/lib/utils/media'
import { cn } from '@/lib/utils/cn'

interface ProductGalleryProps {
  images: ApiClothingImage[]
  productName: string
}

const SUPPORTING_RATIOS = ['aspect-square', 'aspect-3/4', 'aspect-4/5'] as const

/** Cover image first (matches the backend's own cover-image fallback logic), rest in sort order. */
function orderImages(images: ApiClothingImage[]) {
  const cover = images.find((img) => img.is_cover)
  if (!cover) return images
  return [cover, ...images.filter((img) => img.id !== cover.id)]
}

/**
 * Editorial product gallery — magazine-style asymmetric grid (reuses the
 * masonry technique from LookbookSection), with a restrained full-screen
 * viewer for the true, uncropped image. This is the only client boundary
 * on the product detail page.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const ordered = orderImages(images)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : (i + 1) % ordered.length))
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : (i - 1 + ordered.length) % ordered.length))
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, ordered.length])

  const [primary, ...supporting] = ordered

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        aria-label={`Xem ảnh lớn — ${productName}`}
        className="relative block aspect-4/5 w-full overflow-hidden bg-cream"
      >
        <Image
          src={resolveMediaUrl(primary.file_url)}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </button>

      {supporting.length > 0 && (
        <div className="mt-4 columns-2 gap-4">
          {supporting.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setOpenIndex(i + 1)}
              aria-label={`Xem ảnh lớn ${i + 2} — ${productName}`}
              className={cn(
                'relative mb-4 block w-full overflow-hidden bg-cream',
                SUPPORTING_RATIOS[i % SUPPORTING_RATIOS.length],
              )}
            >
              <Image
                src={resolveMediaUrl(img.file_url)}
                alt={productName}
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh phóng to — ${productName}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 p-4 md:p-10"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Đóng"
            autoFocus
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center text-warm-white"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>

          {ordered.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + ordered.length) % ordered.length))}
                aria-label="Ảnh trước"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-warm-white md:left-6"
              >
                <span aria-hidden>←</span>
              </button>
              <button
                type="button"
                onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % ordered.length))}
                aria-label="Ảnh sau"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-warm-white md:right-6"
              >
                <span aria-hidden>→</span>
              </button>
            </>
          )}

          <div className="relative h-full max-h-[85vh] w-full max-w-4xl">
            <Image
              src={resolveMediaUrl(ordered[openIndex].file_url)}
              alt={productName}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
