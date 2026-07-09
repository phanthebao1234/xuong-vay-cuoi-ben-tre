/**
 * Convert a shared-backend media URL to one the Next.js <Image> optimizer
 * can load.
 *
 * Dev: Django returns http://localhost:8000/media/... — Next.js 15+ blocks
 * the optimizer from fetching loopback IPs (SSRF protection), so we strip
 * the origin and let the /media/* rewrite in next.config.ts proxy it.
 * Prod: R2 returns absolute https CDN URLs, allowed via remotePatterns.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('https://')) return url
  if (url.startsWith('http://')) {
    try {
      const parsed = new URL(url)
      return parsed.pathname + parsed.search
    } catch {
      return url
    }
  }
  return url
}
