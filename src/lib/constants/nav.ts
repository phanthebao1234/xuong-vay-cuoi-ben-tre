import { ROUTES } from './routes'

export interface NavLink {
  label: string
  href: string
}

/** Primary navigation. Routes may 404 until their roadmap phase ships. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Trang chủ', href: ROUTES.home },
  { label: 'Váy cưới', href: ROUTES.weddingDresses },
  { label: 'Vest cưới', href: ROUTES.suits },
  { label: 'Áo dài', href: ROUTES.aoDai },
  { label: 'Bộ sưu tập', href: ROUTES.collections },
]

export const FOOTER_EXPLORE: NavLink[] = [
  { label: 'Váy cưới', href: ROUTES.weddingDresses },
  { label: 'Vest cưới', href: ROUTES.suits },
  { label: 'Áo dài cưới', href: ROUTES.aoDai },
  { label: 'Bộ sưu tập', href: ROUTES.collections },
]

export const FOOTER_SERVICES: NavLink[] = [
  { label: 'Thuê váy cưới', href: ROUTES.rental },
  { label: 'Thử váy tại showroom', href: ROUTES.appointment },
  { label: 'Tư vấn trang phục cưới', href: ROUTES.contact },
  { label: 'Đặt lịch hẹn', href: ROUTES.appointment },
]
