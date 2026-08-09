import { NextResponse } from 'next/server'

const pagesOrigin = 'https://sicheng-fan.github.io'

export const corsHeaders = {
  'Access-Control-Allow-Origin': pagesOrigin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  Vary: 'Origin',
}

export function corsJson(data: unknown, init: ResponseInit = {}) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      ...init.headers,
    },
  })
}

export function corsOptions() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
