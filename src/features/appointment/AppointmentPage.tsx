import Link from 'next/link'
import type { ApiClothingDetail } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { AppointmentForm } from './AppointmentForm'
import { ROUTES } from '@/lib/constants/routes'

interface AppointmentPageProps {
  /** Best-effort display context from a ProductCard CTA — never authoritative */
  product: ApiClothingDetail | null
}

export function AppointmentPage({ product }: AppointmentPageProps) {
  const defaultServiceInterest = product
    ? [product.category_name, product.name].filter(Boolean).join(' — ')
    : undefined

  return (
    <>
      <Section tone="cream" className="pb-12 md:pb-16">
        <Container>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-taupe">
            <Link href={ROUTES.home} className="transition-colors hover:text-champagne-deep">
              Trang chủ
            </Link>
            <span aria-hidden className="mx-2 text-champagne">·</span>
            Đặt lịch hẹn
          </p>
          <SectionHeading
            as="h1"
            eyebrow="Đặt lịch hẹn"
            title="Đặt lịch thử trang phục cưới"
            description="Để lại thông tin, đội ngũ tư vấn của xưởng sẽ liên hệ để sắp xếp thời gian thử trang phục phù hợp với bạn — hoàn toàn miễn phí."
          />
          {product && (
            <p className="mt-6 border-l-2 border-champagne pl-4 text-sm text-taupe">
              Bạn đang quan tâm đến <span className="text-charcoal">{product.name}</span>
              {product.category_name && ` (${product.category_name})`}.
            </p>
          )}
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-lg">
            <div className="mb-10 grid grid-cols-3 gap-6 border-b border-line pb-10 text-center">
              <Benefit title="Miễn phí" description="Tư vấn và thử trang phục không mất phí" />
              <Benefit title="Riêng tư" description="Hẹn giờ riêng tại showroom" />
              <Benefit title="Tận tâm" description="Hỗ trợ chọn dáng phù hợp với bạn" />
            </div>

            <AppointmentForm defaultServiceInterest={defaultServiceInterest} />

            <p className="mt-8 text-center text-xs leading-relaxed text-taupe">
              Thông tin của bạn chỉ được dùng để liên hệ sắp xếp lịch hẹn và không được chia sẻ cho bên thứ ba.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}

function Benefit({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="font-display text-lg text-charcoal">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-taupe">{description}</p>
    </div>
  )
}
