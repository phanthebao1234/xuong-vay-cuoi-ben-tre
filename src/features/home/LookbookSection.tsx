import Image from 'next/image'
import Link from 'next/link'
import type { ApiClothingListItem } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ROUTES } from '@/lib/constants/routes'
import { resolveMediaUrl } from '@/lib/utils/media'
import { cn } from '@/lib/utils/cn'

/** Mixed ratios create the discovery-feed rhythm without a masonry library. */
const RATIOS = ['aspect-3/4', 'aspect-square', 'aspect-4/5', 'aspect-square', 'aspect-3/4', 'aspect-4/5'] as const

/**
 * Dense visual discovery moment built from the most recent real items.
 * A lookbook needs density — below 3 items the section reads as empty,
 * so it omits itself. No fake inventory, no fake social-media integration.
 */
export function LookbookSection({ items }: { items: ApiClothingListItem[] }) {
  if (items.length < 3) return null

  const tiles = items.slice(0, 6)

  return (
    <Section>
      <Container width="wide">
        <SectionHeading
          align="center"
          eyebrow="Lookbook"
          title={
            <>
              Khoảnh khắc <em className="italic">từ xưởng</em>
            </>
          }
          description="Những thiết kế mới nhất đang có mặt tại showroom."
          className="mb-12 md:mb-16"
        />

        <div className="columns-2 gap-3 md:columns-3 md:gap-4">
          {tiles.map((item, index) => {
            const imageUrl = resolveMediaUrl(item.cover_image_url)
            return (
              <Link
                key={item.id}
                href={ROUTES.weddingDress(item.slug)}
                className={cn(
                  'group relative mb-3 block overflow-hidden bg-cream md:mb-4',
                  RATIOS[index % RATIOS.length],
                )}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(192,160,98,0.15),transparent_60%)] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  >
                    <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-light italic text-taupe/40">
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/70 to-transparent p-4 pt-10 text-[10px] uppercase tracking-[0.25em] text-warm-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
