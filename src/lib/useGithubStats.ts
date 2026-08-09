'use client'

import { useState, useEffect } from 'react'
import { projects, getRepoName } from '@/data/projects'
import { apiUrl } from '@/lib/api'

type RepoStats = Record<string, { stars: number; forks: number }>

export function useGithubStats() {
  const [stats, setStats] = useState<RepoStats>(() => {
    const initial: RepoStats = {}
    for (const p of projects) {
      const name = getRepoName(p.github)
      initial[name] = { stars: p.stars, forks: p.forks }
    }
    return initial
  })

  useEffect(() => {
    fetch(apiUrl('/api/github'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Object.keys(data).length > 0) setStats(data)
      })
      .catch(() => {})
  }, [])

  function getStats(githubUrl: string) {
    const name = getRepoName(githubUrl)
    return stats[name] || { stars: 0, forks: 0 }
  }

  return { stats, getStats }
}
