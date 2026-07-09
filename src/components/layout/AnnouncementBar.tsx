import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

/** Compact campaign / service statement above the header. Static, no animation. */
export function AnnouncementBar() {
  return (
    <div className="bg-charcoal">
      <Link
        href={ROUTES.appointment}
        className="mx-auto block max-w-6xl px-5 py-2.5 text-center text-[10px] uppercase tracking-[0.25em] text-warm-white/90 transition-colors hover:text-champagne sm:text-[11px]"
      >
        Đặt lịch thử váy riêng tư tại showroom
        <span className="mx-2 text-champagne" aria-hidden>·</span>
        Liên hệ tư vấn
      </Link>
    </div>
  )
}
