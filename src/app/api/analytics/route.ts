import { corsJson, corsOptions } from '@/lib/cors'
import { recordHomeVisit, sourceForRequest } from '@/lib/visitor-analytics'

export const runtime = 'nodejs'
const headers = { 'Cache-Control': 'no-store' }
const acknowledge = () => corsJson({ success: true }, { headers })

// Counters, timelines and legacy details are available only through the
// authenticated dashboard, never through the public ingestion endpoint.
export function GET() {
  return new Response(null, { status: 404, headers })
}

const maxBytes = 2048
async function readPage(request: Request): Promise<string | null> {
  const reader = request.body?.getReader()
  if (!reader) return null
  const chunks: Uint8Array[] = []
  let bytes = 0
  try {
    while (true) {
      const r = await reader.read()
      if (r.done) break
      bytes += r.value.byteLength
      if (bytes > maxBytes) { await reader.cancel(); return null }
      chunks.push(r.value)
    }
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!value || typeof value !== 'object' || !('page' in value) || typeof value.page !== 'string') return null
    return value.page
  } catch { return null } finally { reader.releaseLock() }
}

export async function POST(request: Request) {
  if (request.headers.get('sec-gpc') === '1' || request.headers.get('dnt') === '1') return acknowledge()
  const site = sourceForRequest(request.headers)
  if (!site) return acknowledge()
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return corsJson({ error: 'JSON required' }, { status: 415, headers })
  }
  if (Number(request.headers.get('content-length')) > maxBytes) {
    return corsJson({ error: 'Payload too large' }, { status: 413, headers })
  }
  const page = await readPage(request)
  if (page === null) return corsJson({ error: 'Invalid event' }, { status: 400, headers })
  if (page !== '/' && page !== '/index.html') return acknowledge()
  try {
    recordHomeVisit(site, request.headers)
    return acknowledge()
  } catch {
    // Avoid logging personally identifying event data, paths or request headers.
    console.error('Homepage analytics storage unavailable')
    return corsJson({ error: 'Unavailable' }, { status: 503, headers })
  }
}

export const OPTIONS = corsOptions
