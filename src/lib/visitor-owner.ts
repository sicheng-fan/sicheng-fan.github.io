import 'server-only'
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { promisify } from 'node:util'

const derive = promisify(scrypt)
const sessions = new Map<string, { expires: number; verifier: string }>()
const attempts = new Map<string, { count: number; until: number }>()
export const ownerCookie = '__Host-visitor-session'
export const sessionSeconds = 8 * 60 * 60
const digest = (s: string) => createHash('sha256').update(s).digest('hex')

async function configuration() {
  const file = process.env.VISITOR_OWNER_CONFIG || '/etc/fansicheng/visitor-owner.json'
  const info = await stat(file)
  if (!info.isFile() || (info.mode & 0o077) !== 0 || info.size > 2048) throw new Error('Owner configuration unavailable')
  const c = JSON.parse(await readFile(file, 'utf8'))
  if (!/^[a-f0-9]{32}$/.test(c.salt) || !/^[a-f0-9]{128}$/.test(c.hash)) throw new Error('Invalid owner configuration')
  return { salt: c.salt as string, hash: c.hash as string }
}

export async function authenticateOwner(password: string, client: string) {
  const now = Date.now()
  attempts.forEach((limit, key) => { if (limit.until <= now) attempts.delete(key) })
  const bucket = digest(client)
  const limit = attempts.get(bucket) || { count: 0, until: now + 10 * 60_000 }
  if (limit.count >= 8 || (!attempts.has(bucket) && attempts.size >= 1024)) return { status: 429 } as const
  limit.count++; attempts.set(bucket, limit)
  const config = await configuration()
  const result = await derive(password, Buffer.from(config.salt, 'hex'), 64) as Buffer
  if (!timingSafeEqual(result, Buffer.from(config.hash, 'hex'))) return { status: 401 } as const
  attempts.delete(bucket)
  sessions.forEach((s, key) => { if (s.expires <= now) sessions.delete(key) })
  if (sessions.size >= 8) sessions.delete(sessions.keys().next().value!)
  const token = randomBytes(32).toString('base64url')
  sessions.set(digest(token), { expires: now + sessionSeconds * 1000, verifier: config.hash })
  return { status: 200, token } as const
}

export async function isOwner(token?: string) {
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false
  const key = digest(token), session = sessions.get(key)
  if (!session) return false
  if (session.expires <= Date.now() || session.verifier !== (await configuration()).hash) {
    sessions.delete(key); return false
  }
  return true
}

export function endOwnerSession(token?: string) {
  if (token) sessions.delete(digest(token))
}
