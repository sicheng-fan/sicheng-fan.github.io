#!/usr/bin/env node
/**
 * Sync GitHub stats (stars, forks) into src/data/projects.ts
 * Usage: node scripts/sync-github.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECTS_FILE = resolve(__dirname, '../src/data/projects.ts')
const GITHUB_USERNAME = 'sicheng-fan'

async function fetchRepos() {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated`
  )
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

async function main() {
  console.log(`Fetching repos for ${GITHUB_USERNAME}...`)
  const repos = await fetchRepos()

  const statsMap = {}
  for (const repo of repos) {
    statsMap[repo.name] = {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }
  }

  console.log('\nCurrent GitHub stats:')
  for (const [name, { stars, forks }] of Object.entries(statsMap)) {
    console.log(`  ${name}: ★ ${stars}  ⑂ ${forks}`)
  }

  let content = readFileSync(PROJECTS_FILE, 'utf-8')
  let updated = false

  for (const [repoName, { stars, forks }] of Object.entries(statsMap)) {
    // Match github URL containing this repo name, then update the stars/forks lines after it
    const githubPattern = new RegExp(
      `(github:.*${repoName}'[^}]*?stars:\\s*)\\d+`,
      's'
    )
    const forksPattern = new RegExp(
      `(github:.*${repoName}'[^}]*?forks:\\s*)\\d+`,
      's'
    )

    if (githubPattern.test(content)) {
      content = content.replace(githubPattern, `$1${stars}`)
      content = content.replace(forksPattern, `$1${forks}`)
      updated = true
    }
  }

  if (updated) {
    writeFileSync(PROJECTS_FILE, content, 'utf-8')
    console.log('\n✓ Updated src/data/projects.ts with latest stats')
  } else {
    console.log('\n✓ No changes needed')
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
