import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type ButtonAsButton = ButtonStyleProps &
  ComponentPropsWithoutRef<'button'> & { href?: undefined }

type ButtonAsLink = ButtonStyleProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-sm font-body uppercase ' +
  'tracking-[0.22em] transition-colors duration-300 ' +
  'disabled:pointer-events-none disabled:opacity-40'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-charcoal text-warm-white hover:bg-charcoal/85',
  secondary: 'bg-champagne text-charcoal hover:bg-champagne-deep hover:text-warm-white',
  outline:
    'border border-charcoal/35 bg-transparent text-charcoal ' +
    'hover:border-charcoal hover:bg-charcoal hover:text-warm-white',
  ghost: 'bg-transparent text-charcoal hover:bg-charcoal/5',
  link:
    'rounded-none border-b border-champagne/60 bg-transparent px-0 pb-1 text-charcoal ' +
    'hover:border-champagne hover:text-champagne-deep',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-[11px]',
  lg: 'px-8 py-4 text-xs',
}

/** Renders <Link> when `href` is given, otherwise <button>. Link variant ignores padding sizes. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, ...rest } = props
  const classes = cn(
    BASE,
    VARIANTS[variant],
    variant === 'link' ? 'text-[11px]' : SIZES[size],
    className,
  )

  if (rest.href !== undefined) {
    return <Link {...rest} className={classes} />
  }

  const { type = 'button', ...buttonProps } = rest
  return <button type={type} {...buttonProps} className={classes} />
}
