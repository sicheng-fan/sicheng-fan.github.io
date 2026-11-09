'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { apiUrl, hasAnalyticsBackend } from '@/lib/api'

export function AnalyticsTracker() {
  const pathname = usePathname()
  const counted = useRef(false)
  useEffect(() => {
    if (pathname !== '/') { counted.current = false; return }
    if (counted.current || !hasAnalyticsBackend || navigator.doNotTrack === '1' ||
        (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return
    counted.current = true
    void fetch(apiUrl('/api/analytics'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'omit', referrerPolicy: 'strict-origin', cache: 'no-store', keepalive: true,
      body: JSON.stringify({ page: '/' }),
    }).catch(() => { /* Analytics must never interrupt a visit. */ })
  }, [pathname])
  return null
}
