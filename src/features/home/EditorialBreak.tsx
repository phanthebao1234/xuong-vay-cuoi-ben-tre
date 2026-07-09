import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'

/** Full-bleed charcoal typographic pause between discovery and conversion. */
export function EditorialBreak() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-24 text-warm-white md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(192,160,98,0.12),transparent_60%)]"
      />
      <Container className="relative text-center">
        <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-champagne">
          Triết lý của xưởng
        </p>
        <p className="mx-auto max-w-3xl font-display text-3xl font-light leading-[1.25] md:text-5xl">
          Sự thanh lịch không nằm ở nhiều hơn —{' '}
          <em className="italic">mà ở những điều được chọn kỹ.</em>
        </p>
        <div className="mt-10">
          <Button
            href={ROUTES.collections}
            variant="link"
            className="border-champagne/60 text-warm-white hover:text-champagne"
          >
            Khám phá bộ sưu tập →
          </Button>
        </div>
      </Container>
    </section>
  )
}
