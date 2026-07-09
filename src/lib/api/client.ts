/**
 * Public API client for the shared FOXIE backend.
 *
 * This frontend is PUBLIC-ONLY: it consumes AllowAny endpoints exclusively.
 * There is deliberately no JWT handling, no admin fetch, no token storage —
 * admin operations happen in the FOXIE Admin CMS, never here.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export const API_BASE = `${API_URL}/api/v1`

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface FetchOptions extends Omit<RequestInit, 'next'> {
  /** Revalidation window in seconds. Defaults to 300 (5 min) for catalog data. */
  revalidate?: number | false
}

export async function apiFetch<T>(
  path: string,
  { revalidate = 300, ...options }: FetchOptions = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate },
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, text)
  }

  return res.json() as Promise<T>
}

/**
 * Normalize a DRF list response. All shared-backend list endpoints are
 * paginated ({ count, results }) — this guards against both shapes anyway.
 */
export function unwrapResults<T>(data: T[] | { results?: T[] }): T[] {
  return Array.isArray(data) ? data : (data.results ?? [])
}
