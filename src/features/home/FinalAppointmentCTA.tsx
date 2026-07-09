import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'

/** Final conversion moment — large typography, one clear action. */
export function FinalAppointmentCTA() {
  return (
    <section className="border-t border-line bg-ivory py-24 md:py-36">
      <Container className="text-center">
        <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.4em] text-taupe">
          Bắt đầu từ hôm nay
        </p>
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-light leading-[1.15] text-charcoal md:text-6xl">
          Thiết kế dành cho bạn bắt đầu{' '}
          <em className="italic">từ một buổi thử váy.</em>
        </h2>
        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Button href={ROUTES.appointment} variant="primary" size="lg">
            Đặt lịch thử váy
          </Button>
          <Button href={ROUTES.contact} variant="link">
            Hoặc liên hệ tư vấn →
          </Button>
        </div>
      </Container>
    </section>
  )
}
