import { cn } from '@/lib/utils/cn'

interface SectionProps {
  children: React.ReactNode
  className?: string
  /** Background treatment — ivory (page default), cream (alternating), dark (editorial charcoal) */
  tone?: 'ivory' | 'cream' | 'dark'
  /** Semantic element */
  as?: 'section' | 'div' | 'aside'
  id?: string
}

const TONES = {
  ivory: 'bg-ivory text-charcoal',
  cream: 'bg-cream text-charcoal',
  dark: 'bg-charcoal text-warm-white',
} as const

/** Consistent vertical rhythm for page sections. */
export function Section({ children, className, tone = 'ivory', as: Tag = 'section', id }: SectionProps) {
  return (
    <Tag id={id} className={cn('py-16 md:py-24 lg:py-28', TONES[tone], className)}>
      {children}
    </Tag>
  )
}
