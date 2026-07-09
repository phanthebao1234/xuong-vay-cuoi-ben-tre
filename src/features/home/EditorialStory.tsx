import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Editorial storytelling break — static brand copy, asymmetric composition.
 * Deliberately NOT backed by an API "collection" entity (none exists).
 */
export function EditorialStory() {
  return (
    <Section>
      <Container width="wide">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
          {/* Visual block — editorial placeholder until campaign photography */}
          <div className="md:col-span-5 md:mt-16">
            <div className="relative aspect-3/4 bg-cream">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_30%,rgba(192,160,98,0.18),transparent_60%)]"
              />
              <div aria-hidden className="absolute inset-4 border border-champagne/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-6xl font-light italic text-taupe/40 md:text-7xl">
                  XV
                </span>
              </div>
              <p className="absolute bottom-6 left-6 text-[9px] uppercase tracking-[0.35em] text-taupe">
                Atelier · Bến Tre
              </p>
            </div>
          </div>

          {/* Copy */}
          <div className="md:col-span-6 md:col-start-7">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.4em] text-taupe">
              Câu chuyện của xưởng
            </p>
            <h2 className="font-display text-3xl font-light leading-[1.15] text-charcoal md:text-5xl">
              Được chọn cho <em className="italic">ngày của riêng bạn</em>
            </h2>
            <div className="mt-7 space-y-5 text-sm leading-relaxed text-taupe md:text-base">
              <p>
                Không có hai đám cưới giống nhau — nên cũng không nên có hai
                chiếc váy giống nhau. Mỗi thiết kế tại xưởng được lựa chọn theo
                dáng người, phong cách và câu chuyện của từng cô dâu.
              </p>
              <p>
                Bạn có thể thuê trọn vẹn một thiết kế yêu thích, hoặc cùng xưởng
                điều chỉnh từng chi tiết trong một buổi thử váy riêng tư.
              </p>
            </div>
            <div className="mt-9">
              <Button href={ROUTES.rental} variant="link">
                Tìm hiểu dịch vụ thuê trang phục →
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
