import { cn } from '@/lib/utils/cn'

interface SectionHeadingProps {
  /** Small tracked uppercase label above the title, e.g. "BỘ SƯU TẬP" */
  eyebrow?: string
  title: React.ReactNode
  description?: string
  align?: 'left' | 'center'
  /** Semantic heading level — h2 by default */
  as?: 'h1' | 'h2' | 'h3'
  /** Optional CTA rendered under the description (pass a <Button variant="link">) */
  cta?: React.ReactNode
  /** Set when rendered on a dark section */
  onDark?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  cta,
  onDark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-4 text-[11px] font-medium uppercase tracking-[0.35em]',
            onDark ? 'text-champagne' : 'text-taupe',
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          'font-display text-3xl font-light leading-[1.15] md:text-5xl',
          onDark ? 'text-warm-white' : 'text-charcoal',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            'mt-5 text-sm leading-relaxed md:text-base',
            onDark ? 'text-warm-white/70' : 'text-taupe',
          )}
        >
          {description}
        </p>
      )}
      {cta && <div className={cn('mt-7', align === 'center' && 'flex justify-center')}>{cta}</div>}
    </div>
  )
}
