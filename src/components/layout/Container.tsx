import { cn } from '@/lib/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  /** 'default' for content pages, 'wide' for editorial image grids */
  width?: 'default' | 'wide'
}

/** Consistent horizontal page rhythm. Mobile-first padding, capped width. */
export function Container({ children, className, width = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8 lg:px-12',
        width === 'default' ? 'max-w-6xl' : 'max-w-7xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
