import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawn, execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, access } from 'node:fs/promises'
import { createRequire } from 'node:module'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const project = path.resolve(process.argv[2])
const archive = path.resolve(process.argv[3])
const { JSDOM } = createRequire(path.join(project, 'package.json'))('jsdom')
const temp = await mkdtemp(path.join(os.tmpdir(), 'server-artifact-smoke-'))
let server
let startError
let log = ''
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')

try {
  assert(!temp.startsWith(project + path.sep), 'Smoke directory must be outside the source checkout')
  const expectedHash = (await readFile(archive + '.sha256', 'utf8')).split(/\s+/)[0]
  assert.equal(hash(await readFile(archive)), expectedHash, 'Archive checksum')
  execFileSync('tar', ['-xzf', archive, '-C', temp])
  const manifest = JSON.parse(await readFile(path.join(temp, '.next/server-artifact.json'), 'utf8'))
  for (const [name, entry] of Object.entries(manifest.files)) {
    if (entry.sha256) assert.equal(hash(await readFile(path.join(temp, name))), entry.sha256, name)
  }
  const standalone = path.join(temp, '.next/standalone')
  for (const name of manifest.content_files) {
    assert.equal(hash(await readFile(path.join(standalone, name))), hash(await readFile(path.join(project, name))), name)
  }
  await assert.rejects(access(path.join(standalone, 'data/analytics.json')))

  const socket = net.createServer()
  await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolve) })
  const port = socket.address().port
  await new Promise((resolve) => socket.close(resolve))
  const data = path.join(temp, 'smoke-analytics')
  server = spawn(process.execPath, [path.join(standalone, 'server.js')], {
    cwd: standalone,
    env: { PATH: process.env.PATH, NODE_ENV: 'production', HOSTNAME: '127.0.0.1',
      PORT: String(port), ANALYTICS_DATA_DIR: data, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.on('error', (error) => { startError = error; log += error.message })
  for (const stream of [server.stdout, server.stderr]) stream.on('data', (chunk) => { log = (log + chunk).slice(-12000) })
  const request = async (route, options = {}) => {
    const response = await fetch(`http://127.0.0.1:${port}${route}`, { ...options, signal: AbortSignal.timeout(5000) })
    assert.equal(response.status, 200, route)
    return response
  }
  let ready = false
  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    if (startError) throw startError
    if (server.exitCode !== null) throw new Error('Standalone exited before startup')
    try { await request('/api/analytics'); ready = true; break } catch { await delay(250) }
  }
  assert(ready, 'Standalone did not start')

  let home
  for (const route of ['/', '/projects']) {
    const document = new JSDOM(await (await request(route)).text()).window.document
    assert([...document.querySelectorAll('h3')].some((node) => node.textContent.trim() ===
      'RecreationWorld: Scalable and Verifiable Environments for Hybrid Computer-Use Agents'), route)
    for (const href of ['https://arxiv.org/abs/2609.22000', 'https://github.com/QwenLM/RecreationWorld', 'https://recreation-bench.cc/']) {
      assert(document.querySelector(`a[href="${href}"]`), href)
    }
    if (route === '/') home = document
  }
  const about = new JSDOM(await (await request('/about')).text()).window.document
  const papers = [...about.querySelectorAll('div')].find((node) => node.children.length === 0 && node.textContent.trim() === 'Papers')
  assert.equal(papers?.previousElementSibling?.textContent.trim(), '5')
  assert((await (await request('/timeline')).text()).includes('RecreationWorld Technical Report Released'))
  const blog = new JSDOM(await (await request('/blog/gui-agent-introduction?lang=en')).text()).window.document
  assert.equal(blog.querySelector('h1')?.textContent.trim(), 'From Generative to Executive: GUI Agent')
  assert(blog.querySelector('.katex'), 'Blog math rendering')
  const { results } = await (await request('/api/search')).json()
  assert.equal(results.filter((entry) => entry.type === 'post').length, 22)
  for (const lang of ['en', 'zh']) assert(results.some((entry) => entry.url === `/blog/gui-agent-introduction/?lang=${lang}` && entry.lang === lang))
  for (const route of ['/avatar.png', '/icon.svg',
    home.querySelector('script[src^="/_next/static/"]')?.getAttribute('src'),
    home.querySelector('link[rel="stylesheet"][href^="/_next/static/"]')?.getAttribute('href')]) {
    assert(route, 'Static asset reference missing')
    assert((await (await request(route)).arrayBuffer()).byteLength > 0, route)
  }
  const initial = await (await request('/api/analytics')).json()
  assert.equal(initial.totalVisits, 0)
  const recorded = await (await request('/api/analytics', { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '192.0.2.123' },
    body: JSON.stringify({ page: '/artifact-smoke' }) })).json()
  assert.equal(recorded.totalVisits, 1)
  const saved = JSON.parse(await readFile(path.join(data, 'analytics.json'), 'utf8'))
  assert.equal(saved.totalVisits, 1)
  assert.equal(saved.uniqueVisitors, 1)
  assert.equal((await (await request('/api/analytics')).json()).totalVisits, 1)
  console.log('PASS: isolated standalone, publication pages, blog/search, static assets, and persisted analytics')
} catch (error) {
  console.error(log)
  throw error
} finally {
  if (server?.pid && server.exitCode === null) {
    server.kill('SIGTERM')
    await Promise.race([new Promise((resolve) => server.once('exit', resolve)), delay(3000)])
    if (server.exitCode === null && server.signalCode === null) {
      server.kill('SIGKILL')
      await new Promise((resolve) => server.once('exit', resolve))
    }
  }
  await rm(temp, { recursive: true, force: true })
}
