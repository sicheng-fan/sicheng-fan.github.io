import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { countryForNetwork, publicNetwork } from '../src/lib/visitor-analytics-geo.ts'
import { getVisitorReport, recordHomeVisit, sourceForRequest } from '../src/lib/visitor-analytics.ts'

const geo = ip => countryForNetwork(publicNetwork(ip))
test('offline country lookup handles both address families and never places local or documentation networks', () => {
  assert.equal(geo('8.8.8.8'), 'US')
  assert.equal(geo('1.0.1.17'), 'CN')
  assert.equal(geo('::ffff:1.0.1.17'), 'CN')
  // This anycast network is assigned CA in the November 2026 source CSV.
  assert.equal(geo('2001:4860:4860::8888'), 'CA')
  for (const ip of ['unknown', '::1', 'fe80::c', '2001:db8::12', '203.0.113.4', '127.0.0.1', '192.168.9.8']) {
    assert.equal(publicNetwork(ip), null)
  }
})

test('an unrecognized origin cannot be reclassified using Host or a trusted Referer', () => {
  const source = headers => sourceForRequest(new Headers(headers))
  assert.equal(source({ host: 'fansicheng.online' }), null)
  assert.equal(source({ origin: 'null', referer: 'https://fansicheng.online/' }), null)
  assert.equal(source({ origin: 'https://evil.invalid', referer: 'https://fansicheng.online/' }), null)
  assert.equal(source({ origin: 'https://fansicheng.online', referer: 'https://sicheng-fan.github.io/' }), null)
  assert.equal(source({ referer: 'https://www.fansicheng.online/' }), 'main')
  assert.equal(source({ origin: 'https://sicheng-fan.github.io' }), 'pages')
})

test('real-time and legacy data stay separate, site filters and Shanghai calendar dates remain consistent', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'visitor-stats-test-'))
  const oldDir = process.env.ANALYTICS_DATA_DIR
  process.env.ANALYTICS_DATA_DIR = dir
  try {
    const old = JSON.stringify({ totalVisits: 72, uniqueVisitors: 4, visitors: {
      '8.8.8.8': { pages: ['/', '/blog/private'], visits: 20, userAgent: 'sensitive-legacy' },
      '::ffff:8.8.8.8': { pages: ['/'], visits: 10 },
      '1.0.1.17': { pages: ['/blog'], visits: 40 },
      unknown: { pages: ['/'], visits: 2 },
    } })
    await writeFile(path.join(dir, 'analytics.json'), old)
    const now = Date.parse('2026-11-08T16:01:54Z') // 00:01 on Nov 9 in Shanghai
    recordHomeVisit('main', new Headers({'x-forwarded-for':'8.8.8.8, 1.0.1.17'}), now - 120000)
    recordHomeVisit('pages', new Headers({'x-real-ip':'127.0.0.1', 'user-agent':'sensitive-new'}), now)
    const report = await getVisitorReport({ site: 'all', days: 7 }, now)
    assert.deepEqual(report.countries, [{country:'CN', views:1}])
    assert.deepEqual(report.sites, {main:1, pages:1})
    assert.equal(report.totalViews, 2)
    assert.equal(report.unknownViews, 1)
    assert.deepEqual(report.daily.slice(-2), [{date:'2026-11-08',views:1},{date:'2026-11-09',views:1}])
    assert.deepEqual(report.recent[0], {at:'2026-11-08T16:01:00.000Z',site:'pages',country:null})
    assert.deepEqual(report.legacyHome, {countries:[{country:'US',views:1}],unknownViews:0,totalViews:1})
    assert.deepEqual(report.legacyUnattributed, {views:72,visitors:4})
    const pages = await getVisitorReport({site:'pages',days:30}, now)
    assert.equal(pages.totalViews, 1)
    assert.deepEqual(pages.countries, [])
    assert.equal(pages.recent.length, 1)
    const later = await getVisitorReport({ site:'all', days:90 }, now + 91 * 86_400_000)
    assert.equal(later.totalViews, 0)
    assert.equal(later.recent.length, 0)
    assert.equal(later.legacyHome.totalViews, 1)
    assert.equal(await readFile(path.join(dir, 'analytics.json'), 'utf8'), old)
    const saved = await readFile(path.join(dir, 'analytics-v2.json'), 'utf8')
    assert.doesNotMatch(saved, /8\.8\.8\.8|1\.0\.1\.17|sensitive|userAgent|\/blog/)
  } finally {
    if (oldDir === undefined) delete process.env.ANALYTICS_DATA_DIR
    else process.env.ANALYTICS_DATA_DIR = oldDir
    await rm(dir, { recursive:true, force:true })
  }
})
