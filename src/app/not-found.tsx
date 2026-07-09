import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Không tìm thấy trang',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-ivory py-24">
      <Container className="text-center">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.4em] text-taupe">
          404
        </p>
        <h1 className="mx-auto max-w-2xl font-display text-4xl font-light leading-[1.15] text-charcoal md:text-6xl">
          Trang bạn tìm <em className="italic">không còn ở đây</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-taupe">
          Có thể thiết kế đã được đổi tên hoặc bộ sưu tập đã thay đổi. Hãy bắt
          đầu lại từ trang chủ hoặc xem các bộ sưu tập hiện có.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Button href={ROUTES.home} variant="primary">
            Về trang chủ
          </Button>
          <Button href={ROUTES.collections} variant="link">
            Xem bộ sưu tập →
          </Button>
        </div>
      </Container>
    </section>
  )
}
