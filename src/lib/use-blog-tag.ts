'use client'

import { useCallback, useEffect, useState } from 'react'

export function useBlogTag() {
  const [selectedTag, setSelectedTagState] = useState<string | null>(null)
  useEffect(() => {
    const sync = () => setSelectedTagState(new URLSearchParams(window.location.search).get('tag'))
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('blog-tag-change', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('blog-tag-change', sync)
    }
  }, [])

  const setSelectedTag = useCallback((tag: string | null) => {
    setSelectedTagState(tag)
    const url = new URL(window.location.href)
    if (tag) url.searchParams.set('tag', tag)
    else url.searchParams.delete('tag')
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new window.Event('blog-tag-change'))
  }, [])

  return [selectedTag, setSelectedTag] as const
}
