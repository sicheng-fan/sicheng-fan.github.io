import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OwnerVisitorPage } from '@/components/OwnerVisitorPage'

export const metadata: Metadata = {
  title: '访客地图 · 站主空间', robots: { index: false, follow: false }, referrer: 'no-referrer',
}

export default function OwnerVisitors() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') notFound()
  return <OwnerVisitorPage />
}
