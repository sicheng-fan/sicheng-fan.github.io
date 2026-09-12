'use client'

import { useEffect } from 'react'

export function BlogDocumentMetadata({ title, excerpt }: { title?: string; excerpt?: string }) {
  useEffect(() => {
    if (!title) return
    document.title = `${title} | Fan Sicheng`
    document.querySelector('meta[name="description"]')?.setAttribute('content', excerpt || '')
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', excerpt || '')
  }, [title, excerpt])
  return null
}
