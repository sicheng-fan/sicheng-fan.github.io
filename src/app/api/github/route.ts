import { GITHUB_USERNAME } from '@/data/projects'
import { corsJson } from '@/lib/cors'

interface GitHubRepo {
  name: string
  stargazers_count: number
  forks_count: number
  description: string | null
}

let cache: { data: Record<string, { stars: number; forks: number }> | null; timestamp: number } = {
  data: null,
  timestamp: 0,
}

const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export async function GET() {
  const now = Date.now()
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return corsJson(cache.data)
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated`,
      { next: { revalidate: 600 } }
    )

    if (!res.ok) {
      if (cache.data) return corsJson(cache.data)
      return corsJson({}, { status: 502 })
    }

    const repos: GitHubRepo[] = await res.json()
    const stats: Record<string, { stars: number; forks: number }> = {}

    for (const repo of repos) {
      stats[repo.name] = {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
      }
    }

    cache = { data: stats, timestamp: now }
    return corsJson(stats)
  } catch {
    if (cache.data) return corsJson(cache.data)
    return corsJson({}, { status: 502 })
  }
}
