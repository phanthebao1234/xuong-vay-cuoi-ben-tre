import type { LeadSubmitPayload, LeadSubmitResponse, ApiValidationError } from '@/types'

export type SubmitLeadResult =
  | { ok: true; data: LeadSubmitResponse }
  | { ok: false; kind: 'validation'; errors: ApiValidationError }
  | { ok: false; kind: 'network' | 'server' }

/**
 * Posts through this app's own /api/appointment route (same-origin) rather
 * than FOXIE directly — see that route's comment for why (CORS).
 */
export async function submitLead(payload: LeadSubmitPayload): Promise<SubmitLeadResult> {
  try {
    const res = await fetch('/api/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.status === 201) {
      return { ok: true, data: (await res.json()) as LeadSubmitResponse }
    }
    if (res.status === 400) {
      const errors = (await res.json().catch(() => ({}))) as ApiValidationError
      return { ok: false, kind: 'validation', errors }
    }
    return { ok: false, kind: 'server' }
  } catch {
    return { ok: false, kind: 'network' }
  }
}
