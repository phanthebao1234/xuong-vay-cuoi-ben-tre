import type { Metadata } from 'next'
import { fetchRentalCategories, fetchClothingList } from '@/lib/api/rentals'
import { JsonLd } from '@/components/shared/JsonLd'
import { SITE } from '@/lib/config/site'
import { ROUTES } from '@/lib/constants/routes'
import { HeroSection } from '@/features/home/HeroSection'
import { BrandManifesto } from '@/features/home/BrandManifesto'
import { CategoryDiscovery } from '@/features/home/CategoryDiscovery'
import { EditorialStory } from '@/features/home/EditorialStory'
import { FeaturedProducts } from '@/features/home/FeaturedProducts'
import { EditorialBreak } from '@/features/home/EditorialBreak'
import { WhyChooseUs } from '@/features/home/WhyChooseUs'
import { AppointmentProcess } from '@/features/home/AppointmentProcess'
import { LookbookSection } from '@/features/home/LookbookSection'
import { FinalAppointmentCTA } from '@/features/home/FinalAppointmentCTA'

export const metadata: Metadata = {
  title: 'Váy cưới, vest cưới & áo dài cưới cao cấp tại Bến Tre',
  description:
    'Xưởng Váy Cưới Bến Tre — thiết kế và cho thuê váy cưới, vest cưới, áo dài cưới cao cấp. Đặt lịch thử váy riêng tư tại showroom Bến Tre, tư vấn miễn phí cho từng cô dâu.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Xưởng Váy Cưới Bến Tre — Váy cưới & vest cưới cao cấp',
    description:
      'Thiết kế và cho thuê trang phục cưới cao cấp tại Bến Tre. Đặt lịch thử váy riêng tư ngay hôm nay.',
    type: 'website',
    locale: 'vi_VN',
  },
}

/**
 * Homepage — Server Component with ISR (revalidate 300 s per fetch).
 * Each request fails independently to an empty list so the editorial
 * sections always render even when the shared API is empty or down.
 * Data-driven sections (categories / featured / lookbook) omit themselves
 * cleanly when there is nothing real to show — never fake inventory.
 */
// Derived from the real, already-used SITE.address ("Bến Tre, Việt Nam") —
// never a separately invented locality/country.
const [ADDRESS_LOCALITY, ADDRESS_COUNTRY] = SITE.address.split(',').map((part) => part.trim())

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/apple-icon`,
      description: SITE.description,
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE.url}/#localbusiness`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      image: `${SITE.url}/opengraph-image`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: ADDRESS_LOCALITY,
        addressCountry: ADDRESS_COUNTRY,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      name: SITE.name,
      url: SITE.url,
      inLanguage: 'vi-VN',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE.url}${ROUTES.weddingDresses}?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default async function HomePage() {
  const [categories, featured, recent] = await Promise.all([
    fetchRentalCategories().catch(() => []),
    fetchClothingList({ is_featured: true, status: 'available' })
      .then((data) => data.results ?? [])
      .catch(() => []),
    fetchClothingList({ ordering: '-created_at' })
      .then((data) => data.results ?? [])
      .catch(() => []),
  ])

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <HeroSection />
      <BrandManifesto />
      <CategoryDiscovery categories={categories} />
      <EditorialStory />
      <FeaturedProducts items={featured} />
      <EditorialBreak />
      <WhyChooseUs />
      <AppointmentProcess />
      <LookbookSection items={recent} />
      <FinalAppointmentCTA />
    </>
  )
}
