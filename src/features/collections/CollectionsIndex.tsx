import type { ApiRentalCategory } from '@/types'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { CategoryTile } from '@/components/shared/CategoryTile'
import { EmptyState } from '@/components/shared/EmptyState'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

/**
 * Collections index — real RentalCategory data.
 * `categories === null` means the API was unreachable (distinct from an
 * empty catalog); both get an intentional editorial state, never a blank page.
 */
export function CollectionsIndex({ categories }: { categories: ApiRentalCategory[] | null }) {
  return (
    <>
      <Section tone="cream" className="pb-12 md:pb-16">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Bộ sưu tập"
            title={
              <>
                Mỗi bộ sưu tập, <em className="italic">một câu chuyện</em>
              </>
            }
            description="Váy cưới, vest cưới và áo dài cưới — được tuyển chọn và sắp xếp để bạn tìm thấy thiết kế thuộc về ngày của mình."
          />
        </Container>
      </Section>

      <Section>
        <Container width="wide">
          {categories === null ? (
            <EmptyState
              eyebrow="Tạm thời gián đoạn"
              title={<>Không tải được bộ sưu tập lúc này</>}
              description="Vui lòng thử lại sau ít phút, hoặc đặt lịch hẹn để được tư vấn trực tiếp tại showroom."
              cta={<Button href={ROUTES.appointment} variant="outline">Đặt lịch hẹn</Button>}
            />
          ) : categories.length === 0 ? (
            <EmptyState
              eyebrow="Sắp ra mắt"
              title={<>Bộ sưu tập đang được <em className="italic">chuẩn bị</em></>}
              description="Những thiết kế đầu tiên đang trên đường đến showroom. Đặt lịch hẹn để là người đầu tiên trải nghiệm."
              cta={<Button href={ROUTES.appointment} variant="outline">Đặt lịch thử váy</Button>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {categories.map((category, index) => (
                <CategoryTile
                  key={category.id}
                  category={category}
                  large={index === 0}
                  className={cn(
                    'aspect-4/3',
                    // Single category → full-width editorial banner
                    categories.length === 1 && 'md:col-span-2 md:aspect-21/9',
                    // Odd count → first tile spans the full row
                    categories.length > 1 && categories.length % 2 === 1 && index === 0 && 'md:col-span-2 md:aspect-2/1',
                  )}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
