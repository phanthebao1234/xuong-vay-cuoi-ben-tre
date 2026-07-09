import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

/** Emotional brand introduction — pure typography, generous whitespace. */
export function BrandManifesto() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.4em] text-taupe">
            Xưởng may đo & cho thuê trang phục cưới
          </p>
          <p className="font-display text-3xl font-light leading-[1.3] text-charcoal md:text-5xl">
            Một chiếc váy cưới không chỉ để mặc —{' '}
            <em className="italic">mà để trở thành một phần của câu chuyện</em>{' '}
            bạn sẽ kể mãi về sau.
          </p>
          <div aria-hidden className="mx-auto my-10 h-px w-16 bg-champagne" />
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-taupe md:text-base">
            Từ chất liệu, phom dáng đến từng đường kim mũi chỉ, mỗi thiết kế tại
            xưởng đều được chăm chút để tôn lên vẻ đẹp riêng của người mặc —
            không phải của bất kỳ ai khác.
          </p>
        </div>
      </Container>
    </Section>
  )
}
