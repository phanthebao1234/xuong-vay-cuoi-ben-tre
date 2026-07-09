/**
 * Public route map. Planned routes are documented in docs/ARCHITECTURE.md —
 * only implemented routes should be linked from navigation.
 */
export const ROUTES = {
  home: '/',
  collections: '/collections',
  collection: (slug: string) => `/collections/${slug}`,
  weddingDresses: '/wedding-dresses',
  weddingDress: (slug: string) => `/wedding-dresses/${slug}`,
  suits: '/suits',
  suit: (slug: string) => `/suits/${slug}`,
  aoDai: '/ao-dai',
  aoDaiDetail: (slug: string) => `/ao-dai/${slug}`,
  rental: '/rental',
  appointment: '/appointment',
  about: '/about',
  contact: '/contact',
} as const
