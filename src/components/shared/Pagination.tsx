import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  page: number
  hasPrevious: boolean
  hasNext: boolean
  /** Builds the href for a given page number, preserving any active filters. */
  buildHref: (page: number) => string
}

/** DRF previous/next-driven pagination — plain links, no client JS. */
export function Pagination({ page, hasPrevious, hasNext, buildHref }: PaginationProps) {
  if (!hasPrevious && !hasNext) return null

  const linkClasses =
    'inline-flex items-center gap-2 border-b border-champagne/60 pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors hover:border-champagne hover:text-champagne-deep'

  return (
    <nav aria-label="Phân trang" className="mt-14 flex items-center justify-between border-t border-line pt-8">
      {hasPrevious ? (
        <Link href={buildHref(page - 1)} className={linkClasses}>
          ← Trang trước
        </Link>
      ) : (
        <span aria-hidden />
      )}
      <span className="text-[10px] uppercase tracking-[0.3em] text-taupe">Trang {page}</span>
      {hasNext ? (
        <Link href={buildHref(page + 1)} className={cn(linkClasses, 'text-right')}>
          Trang sau →
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  )
}
