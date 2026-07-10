import type { Metadata } from 'next'
import { fetchClothingDetail } from '@/lib/api/rentals'
import { AppointmentPage } from '@/features/appointment/AppointmentPage'

export const metadata: Metadata = {
  title: 'Đặt lịch hẹn thử trang phục',
  description:
    'Đặt lịch hẹn thử váy cưới, vest cưới, áo dài cưới tại Xưởng Váy Cưới Bến Tre — tư vấn riêng, hoàn toàn miễn phí.',
  alternates: { canonical: '/appointment' },
}

interface PageProps {
  searchParams: Promise<{ product?: string }>
}

export default async function AppointmentRoutePage({ searchParams }: PageProps) {
  const { product: slug } = await searchParams
  // Best-effort display context only — a failed/invalid slug never blocks the page.
  const product = slug ? await fetchClothingDetail(slug).catch(() => null) : null

  return <AppointmentPage product={product} />
}
