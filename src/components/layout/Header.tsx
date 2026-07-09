'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/constants/nav'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  /**
   * 'solid'       — ivory background at all times (internal pages, default).
   * 'transparent' — transparent over a dark hero, turns solid after scroll.
   * The homepage (`/`) always renders transparent (dark hero behind the
   * sticky header via negative margin — see HeroSection).
   */
  variant?: 'solid' | 'transparent'
}

/** Desktop nav shows the section links; "Trang chủ" is the wordmark. */
const DESKTOP_LINKS = NAV_LINKS.filter((link) => link.href !== ROUTES.home)

export function Header({ variant = 'solid' }: HeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the menu when the route changes (e.g. browser back while open).
  // State-adjustment-during-render pattern — see react.dev "You Might Not Need an Effect".
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  const isTransparent = variant === 'transparent' || pathname === '/'
  const isSolid = !isTransparent || scrolled

  useEffect(() => {
    if (!isTransparent) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isTransparent])

  // Escape closes; body scroll locks while open
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const textTone = isSolid ? 'text-charcoal' : 'text-warm-white'

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-300',
        isSolid ? 'border-b border-line bg-ivory/98' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 md:h-20 lg:px-12">
        {/* Left: desktop navigation */}
        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {DESKTOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'border-b pb-1 text-[11px] uppercase tracking-[0.22em] transition-colors',
                    textTone,
                    isActive(link.href)
                      ? 'border-champagne'
                      : 'border-transparent hover:border-champagne/50',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile: menu trigger (left) */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className={cn('-ml-2 flex h-11 w-11 flex-col items-start justify-center gap-1.5 px-2 lg:hidden', textTone)}
        >
          <span aria-hidden className="block h-px w-6 bg-current" />
          <span aria-hidden className="block h-px w-4 bg-current" />
        </button>

        {/* Center: brand */}
        <Link href={ROUTES.home} className={cn('text-center', textTone)}>
          <span className="block font-display text-lg font-medium tracking-[0.08em] md:text-xl">
            XƯỞNG VÁY CƯỚI
          </span>
          <span className="mt-0.5 block text-[9px] uppercase tracking-[0.5em] text-champagne">
            Bến Tre
          </span>
        </Link>

        {/* Right: appointment CTA */}
        <div className="flex items-center justify-end">
          <Link
            href={ROUTES.appointment}
            className={cn(
              'hidden border px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-colors sm:inline-block',
              isSolid
                ? 'border-charcoal/35 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-warm-white'
                : 'border-warm-white/50 text-warm-white hover:bg-warm-white hover:text-charcoal',
            )}
          >
            Đặt lịch thử váy
          </Link>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng"
          className="fixed inset-0 z-50 flex flex-col bg-charcoal"
        >
          <div className="flex h-16 items-center justify-between px-5 sm:px-8 md:h-20">
            <span className="font-display text-lg font-medium tracking-[0.08em] text-warm-white">
              XƯỞNG VÁY CƯỚI
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Đóng menu"
              autoFocus
              className="flex h-11 w-11 items-center justify-center text-warm-white"
            >
              <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          <nav aria-label="Điều hướng chính" className="flex flex-1 items-center px-8">
            <ul className="space-y-6">
              {NAV_LINKS.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={cn(
                      'flex items-baseline gap-4 font-display text-3xl font-light transition-colors',
                      isActive(link.href) ? 'text-champagne' : 'text-warm-white hover:text-champagne',
                    )}
                  >
                    <span className="text-[10px] tracking-[0.3em] text-taupe" aria-hidden>
                      0{index + 1}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-warm-white/10 px-8 py-8">
            <Link
              href={ROUTES.appointment}
              onClick={() => setMenuOpen(false)}
              className="block bg-champagne px-6 py-4 text-center text-[11px] uppercase tracking-[0.22em] text-charcoal transition-colors hover:bg-champagne-deep hover:text-warm-white"
            >
              Đặt lịch thử váy
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
