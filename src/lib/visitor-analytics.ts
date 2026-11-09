import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { publicNetwork, countryForNetwork } from './visitor-analytics-geo'
import type { CountryCount, VisitorEvent, VisitorFilter, VisitorReport, VisitorSource } from './visitor-analytics-types'

// Only the two public site origins can contribute to the homepage report.
export function sourceForRequest(headers: Headers): VisitorSource | null {
  const origin = headers.get('origin')
  const referrer = headers.get('referer')
  try {
    // A supplied Origin is authoritative; never fall back from a foreign one.
    const source = origin ?? (referrer ? new URL(referrer).origin : '')
    if (referrer && new URL(referrer).origin !== source) return null
    if (source === 'https://sicheng-fan.github.io') return 'pages'
    if (source === 'https://fansicheng.online' || source === 'https://www.fansicheng.online') return 'main'
  } catch { /* No trusted source. */ }
  return null
}

type Counts = Record<string, number>
type Day = Record<VisitorSource, Counts>
interface State {
  version: 2
  trackingSince: string
  days: Record<string, Day>
  recent: VisitorEvent[]
  legacyUnattributed: VisitorReport['legacyUnattributed']
  legacyHome: VisitorReport['legacyHome']
}
const DAY = 86_400_000
const sites = ['main', 'pages'] as const
const localDate = (time: number) => new Date(time + 8 * 3_600_000).toISOString().slice(0, 10)
const minute = (time: number) => new Date(Math.floor(time / 60_000) * 60_000).toISOString()
const count = (n: unknown) => typeof n === 'number' && Number.isSafeInteger(n) && n > 0 ? n : 0
const ranked = (counts: Counts): CountryCount[] => Object.entries(counts)
  .filter(([country]) => country !== 'ZZ')
  .map(([country, views]) => ({ country, views }))
  .sort((a, b) => b.views - a.views || a.country.localeCompare(b.country))
const dataDir = () => process.env.ANALYTICS_DATA_DIR || path.join(process.cwd(), 'data')
const stateFile = () => path.join(dataDir(), 'analytics-v2.json')

function initialize(now: number): State {
  const state: State = {
    version: 2, trackingSince: minute(now), days: {}, recent: [],
    legacyUnattributed: { views: 0, visitors: 0 },
    legacyHome: { countries: [], unknownViews: 0, totalViews: 0 },
  }
  // The original data belongs to the operator: import once, read-only. It
  // cannot tell us a visitor's source host or how often they viewed any page.
  const oldFile = path.join(dataDir(), 'analytics.json')
  if (!fs.existsSync(oldFile)) return state
  const old = JSON.parse(fs.readFileSync(oldFile, 'utf8'))
  if (!old || typeof old.visitors !== 'object' || !old.visitors || Array.isArray(old.visitors)) {
    throw new Error('Invalid legacy analytics file')
  }
  state.legacyUnattributed = { views: count(old.totalVisits), visitors: count(old.uniqueVisitors) }
  const countries: Counts = {}
  const seen = new Set<string>()
  for (const [ip, visitor] of Object.entries(old.visitors) as [string, { pages?: unknown } | null][]) {
    if (!Array.isArray(visitor?.pages) || !visitor.pages.includes('/')) continue
    const network = publicNetwork(ip)
    if (!network) continue
    const networkKey = network.toString('hex')
    if (seen.has(networkKey)) continue
    seen.add(networkKey)
    const country = countryForNetwork(network) ?? 'ZZ'
    countries[country] = (countries[country] || 0) + 1
  }
  state.legacyHome = { countries: ranked(countries), unknownViews: countries.ZZ || 0, totalViews: seen.size }
  return state
}

function save(state: State) {
  const file = stateFile()
  fs.mkdirSync(dataDir(), { recursive: true, mode: 0o700 })
  const temp = file + '.' + randomUUID() + '.tmp'
  try {
    fs.writeFileSync(temp, JSON.stringify(state), { mode: 0o600, flag: 'wx' })
    fs.renameSync(temp, file)
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp)
  }
}

// PM2 runs one Node server. Keep each read/modify/rename synchronous: there
// is no yield between requests, and readers observe only complete snapshots.
function load(now: number): State {
  const file = stateFile()
  if (!fs.existsSync(file)) {
    const initial = initialize(now)
    save(initial)
    return initial
  }
  const state: State = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (state.version !== 2 || !state.days || !Array.isArray(state.recent) ||
      !state.legacyHome || !state.legacyUnattributed || !state.trackingSince) {
    throw new Error('Invalid analytics snapshot')
  }
  const cutoff = localDate(now - 89 * DAY)
  let changed = false
  for (const date of Object.keys(state.days)) {
    if (date < cutoff) { delete state.days[date]; changed = true }
  }
  const recent = state.recent.filter(event => localDate(Date.parse(event.at)) >= cutoff)
  if (recent.length !== state.recent.length) { state.recent = recent; changed = true }
  if (changed) save(state)
  return state
}

// Only called for verified homepage requests. Never accept visitor-supplied
// country, site or time values. Nginx overwrites X-Real-IP and appends the
// peer to X-Forwarded-For; never trust the caller-provided leftmost entry.
export function recordHomeVisit(site: VisitorSource, headers: Headers, now = Date.now()) {
  const forwarded = headers.get('x-forwarded-for')?.split(',').pop() ?? ''
  const network = publicNetwork(headers.get('x-real-ip') || forwarded)
  const country = countryForNetwork(network)
  const state = load(now)
  const date = localDate(now)
  const daily = state.days[date] ??= { main: {}, pages: {} }
  const bucket = country ?? 'ZZ'
  daily[site][bucket] = (daily[site][bucket] || 0) + 1
  state.recent.unshift({ at: minute(now), site, country })
  const retained = { main: 0, pages: 0 }
  state.recent = state.recent.filter(event => ++retained[event.site] <= 20)
  save(state)
}

export async function getVisitorReport({ site, days }: VisitorFilter, now = Date.now()): Promise<VisitorReport> {
  const state = load(now)
  const countries: Counts = {}
  const siteViews = { main: 0, pages: 0 }
  const daily = []
  for (let i = days - 1; i >= 0; i--) {
    const date = localDate(now - i * DAY)
    let views = 0
    for (const source of sites) {
      if (site !== 'all' && site !== source) continue
      for (const [country, n] of Object.entries(state.days[date]?.[source] || {})) {
        countries[country] = (countries[country] || 0) + n
        siteViews[source] += n
        views += n
      }
    }
    daily.push({ date, views })
  }
  const cutoff = daily[0].date
  return {
    site, days, timezone: 'Asia/Shanghai', trackingSince: state.trackingSince, daily,
    countries: ranked(countries), unknownViews: countries.ZZ || 0,
    totalViews: siteViews.main + siteViews.pages, sites: siteViews,
    recent: state.recent.filter(event => (site === 'all' || event.site === site) &&
      localDate(Date.parse(event.at)) >= cutoff).slice(0, 20),
    legacyUnattributed: state.legacyUnattributed, legacyHome: state.legacyHome,
  }
}
