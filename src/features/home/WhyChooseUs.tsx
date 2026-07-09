import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'

/** Editorial numbered statements — no icon cards, no invented statistics. */
const REASONS = [
  {
    number: '01',
    title: 'Thiết kế được tuyển chọn',
    description:
      'Không chạy theo số lượng — mỗi mẫu trong xưởng đều được chọn vì phom dáng, chất liệu và cảm xúc nó mang lại.',
  },
  {
    number: '02',
    title: 'Trải nghiệm thử váy riêng tư',
    description:
      'Một buổi hẹn dành riêng cho bạn tại showroom — đủ thời gian, đủ yên tĩnh để lựa chọn đúng.',
  },
  {
    number: '03',
    title: 'Tư vấn theo từng cô dâu',
    description:
      'Dáng người, tông màu cưới, không gian tiệc — lựa chọn được gợi ý cho riêng câu chuyện của bạn.',
  },
] as const

export function WhyChooseUs() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Vì sao chọn xưởng"
          title={
            <>
              Ít hơn, nhưng <em className="italic">đúng hơn</em>
            </>
          }
          className="mb-14 md:mb-20"
        />
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {REASONS.map((reason) => (
            <div key={reason.number} className="border-t border-line pt-6">
              <p className="font-display text-2xl font-light italic text-champagne">
                {reason.number}
              </p>
              <h3 className="mt-4 font-display text-xl font-normal text-charcoal md:text-2xl">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-taupe">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
