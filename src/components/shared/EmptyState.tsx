import { cn } from '@/lib/utils/cn'

/**
 * Premium editorial empty state — used when API data is empty or
 * unavailable. Never a blank page, never fake inventory.
 */
export function EmptyState({
  eyebrow,
  title,
  description,
  cta,
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  cta?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative mx-auto max-w-2xl border border-line px-8 py-16 text-center md:py-24',
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-2 border border-champagne/20" />
      {eyebrow && (
        <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-taupe">
          {eyebrow}
        </p>
      )}
      <p className="font-display text-2xl font-light leading-snug text-charcoal md:text-3xl">
        {title}
      </p>
      {description && (
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-taupe">
          {description}
        </p>
      )}
      {cta && <div className="mt-8 flex justify-center">{cta}</div>}
    </div>
  )
}
