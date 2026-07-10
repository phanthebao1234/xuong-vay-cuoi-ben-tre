import { NextResponse } from 'next/server'
import { API_BASE } from '@/lib/api/client'

/**
 * Same-origin proxy for POST /leads/submit/. A direct browser → FOXIE POST
 * fails CORS today (this site's origin is not yet in FOXIE's
 * CORS_ALLOWED_ORIGINS — verified empirically, see docs/API_INTEGRATION.md).
 * This route runs server-side, so it isn't subject to browser CORS, and
 * simply relays FOXIE's exact status code and body — never invents or
 * rewrites the response.
 */

// Must match the hidden field name in AppointmentForm.tsx.
const HONEYPOT_FIELD = 'company'

// The only fields LeadPublicSerializer accepts — anything else sent to this
// route is dropped before it ever reaches FOXIE.
const ALLOWED_LEAD_FIELDS = ['name', 'phone', 'email', 'message', 'service_interest', 'source'] as const

function pickLeadFields(payload: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of ALLOWED_LEAD_FIELDS) {
    if (key in payload) result[key] = payload[key]
  }
  return result
}

export async function POST(request: Request) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ detail: 'Yêu cầu không hợp lệ.' }, { status: 400 })
  }

  if (typeof raw !== 'object' || raw === null) {
    return NextResponse.json({ detail: 'Yêu cầu không hợp lệ.' }, { status: 400 })
  }
  const body = raw as Record<string, unknown>

  // Honeypot: legitimate users never fill this (visually hidden, aria-hidden,
  // removed from tab order). A non-empty value is a strong bot signal — skip
  // FOXIE entirely and return the same success shape a real submission would
  // get, so bot-detection behavior is never revealed to the caller.
  const honeypot = body[HONEYPOT_FIELD]
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return NextResponse.json({ detail: 'Cảm ơn! Chúng tôi sẽ liên hệ bạn sớm.' }, { status: 201 })
  }

  try {
    const res = await fetch(`${API_BASE}/leads/submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pickLeadFields(body)),
      cache: 'no-store',
    })
    const responseBody = await res.json().catch(() => ({}))
    return NextResponse.json(responseBody, { status: res.status })
  } catch {
    return NextResponse.json({ detail: 'Không thể kết nối đến máy chủ.' }, { status: 502 })
  }
}
