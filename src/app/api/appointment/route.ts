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
export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ detail: 'Yêu cầu không hợp lệ.' }, { status: 400 })
  }

  try {
    const res = await fetch(`${API_BASE}/leads/submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })
    const body = await res.json().catch(() => ({}))
    return NextResponse.json(body, { status: res.status })
  } catch {
    return NextResponse.json({ detail: 'Không thể kết nối đến máy chủ.' }, { status: 502 })
  }
}
