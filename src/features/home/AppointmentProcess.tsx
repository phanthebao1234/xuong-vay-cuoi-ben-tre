import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'

const STEPS = [
  {
    number: '01',
    title: 'Chọn phong cách',
    description: 'Xem bộ sưu tập trực tuyến và lưu lại những thiết kế bạn muốn thử.',
  },
  {
    number: '02',
    title: 'Đặt lịch tư vấn',
    description: 'Chọn khung giờ phù hợp — buổi hẹn tại showroom dành riêng cho bạn.',
  },
  {
    number: '03',
    title: 'Thử & hoàn thiện lựa chọn',
    description: 'Thử trực tiếp cùng người tư vấn và điều chỉnh đến khi vừa vặn hoàn hảo.',
  },
] as const

/** Conversion-flow explainer — horizontal on desktop, vertical on mobile. */
export function AppointmentProcess() {
  return (
    <Section tone="cream">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Quy trình đơn giản"
          title={
            <>
              Từ bộ sưu tập đến <em className="italic">buổi thử váy của bạn</em>
            </>
          }
          className="mb-14 md:mb-20"
        />

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.number} className="relative text-center md:px-4">
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-[-16px] top-7 hidden h-px w-8 bg-champagne/40 md:block"
                />
              )}
              <p className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-champagne/50 font-display text-lg font-light italic text-champagne">
                {step.number}
              </p>
              <h3 className="mt-5 font-display text-xl font-normal text-charcoal">
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-taupe">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 text-center">
          <Button href={ROUTES.appointment} variant="primary" size="lg">
            Đặt lịch thử váy
          </Button>
        </div>
      </Container>
    </Section>
  )
}
