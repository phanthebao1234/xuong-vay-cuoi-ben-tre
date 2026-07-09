import Link from 'next/link'
import { FOOTER_EXPLORE, FOOTER_SERVICES } from '@/lib/constants/nav'
import { ROUTES } from '@/lib/constants/routes'
import { SITE } from '@/lib/config/site'

function FooterColumn({
  heading,
  links,
}: {
  heading: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-champagne">
        {heading}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-warm-white/70 transition-colors hover:text-warm-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-warm-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20 lg:px-12">
        {/* Brand statement + CTA */}
        <div className="mb-14 flex flex-col gap-8 border-b border-warm-white/10 pb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <p className="font-display text-3xl font-light italic leading-snug md:text-4xl">
              {SITE.name}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-warm-white/60">
              Thiết kế và cho thuê trang phục cưới cao cấp — váy cưới, vest cưới,
              áo dài cưới — dành cho ngày trọng đại của bạn.
            </p>
          </div>
          <Link
            href={ROUTES.appointment}
            className="inline-block self-start bg-champagne px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-charcoal transition-colors hover:bg-champagne-deep hover:text-warm-white md:self-auto"
          >
            Đặt lịch hẹn tư vấn
          </Link>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
          <FooterColumn heading="Khám phá" links={FOOTER_EXPLORE} />
          <FooterColumn heading="Dịch vụ" links={FOOTER_SERVICES} />
          <div>
            <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-champagne">
              Liên hệ
            </h3>
            <address className="space-y-3 text-sm not-italic text-warm-white/70">
              <p>{SITE.address}</p>
              <p>
                <Link href={ROUTES.contact} className="transition-colors hover:text-warm-white">
                  Trang liên hệ
                </Link>
              </p>
            </address>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-14 border-t border-warm-white/10 pt-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-warm-white/40">
            © {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
