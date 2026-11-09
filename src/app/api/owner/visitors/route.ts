import { NextRequest, NextResponse } from 'next/server'
import { authenticateOwner, endOwnerSession, isOwner, ownerCookie, sessionSeconds } from '@/lib/visitor-owner'
import { getVisitorReport } from '@/lib/visitor-analytics'

const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'Vary': 'Cookie', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' }
const reply = (body: unknown, status: number) => NextResponse.json(body, { status, headers })
const cookieOptions = { httpOnly: true, secure: true, sameSite: 'strict' as const, path: '/' }

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (!origin) return false
  try {
    const url = new URL(origin)
    if (url.host !== req.headers.get('host')) return false
    return ['https://fansicheng.online', 'https://www.fansicheng.online'].includes(origin) ||
      (process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1'].includes(url.hostname))
  } catch { return false }
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return reply({ error: 'forbidden' }, 403)
  if (req.headers.get('content-type')?.split(';')[0] !== 'application/json') return reply({ error: 'invalid_request' }, 400)
  const size = Number(req.headers.get('content-length'))
  if (size > 2048) return reply({ error: 'invalid_request' }, 413)
  const body = await req.json().catch(() => null)
  if (typeof body?.password !== 'string' || !body.password.length || body.password.length > 256) return reply({ error: 'invalid_request' }, 400)
  try {
    const result = await authenticateOwner(body.password, req.headers.get('x-real-ip') || 'local')
    if (result.status !== 200) return reply({ error: result.status === 429 ? 'try_later' : 'invalid_password' }, result.status)
    const response = reply({ ok: true }, 200)
    response.cookies.set(ownerCookie, result.token, { ...cookieOptions, maxAge: sessionSeconds })
    return response
  } catch { return reply({ error: 'unavailable' }, 503) }
}

export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return reply({ error: 'forbidden' }, 403)
  endOwnerSession(req.cookies.get(ownerCookie)?.value)
  const response = reply({ ok: true }, 200)
  response.cookies.set(ownerCookie, '', { ...cookieOptions, maxAge: 0 })
  return response
}

export async function GET(req: NextRequest) {
  // On a static mirror there is no dashboard API and no report to export.
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') return reply({ error: 'not_found' }, 404)
  const token = req.cookies.get(ownerCookie)?.value
  try {
    if (!await isOwner(token)) return reply({ error: 'unauthorized' }, 401)
    const query = req.nextUrl.searchParams
    const site = query.get('site') || 'all', days = Number(query.get('days') || '30')
    if ((site !== 'all' && site !== 'main' && site !== 'pages') || (days !== 7 && days !== 30 && days !== 90)) return reply({ error: 'invalid_filter' }, 400)
    return reply(await getVisitorReport({ site, days }), 200)
  } catch { return reply({ error: 'unavailable' }, 503) }
}
