// Generate a high-entropy owner password. Neither file may already exist.
import { randomBytes, scryptSync } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const args = process.argv.slice(2)
if (args.length !== 2) throw new Error('Usage: node scripts/create-visitor-owner.mjs LOCAL_LOGIN_FILE SERVER_VERIFIER_FILE')
const [login, verifier] = args.map(p => resolve(p))
if (login === verifier || existsSync(login) || existsSync(verifier)) throw new Error('Use distinct, unused paths. No credentials were changed.')
process.umask(0o077)
for (const file of [login, verifier]) mkdirSync(dirname(file), { recursive: true, mode: 0o700 })
const salt = randomBytes(16), password = randomBytes(32).toString('base64url')
const hash = scryptSync(password, salt, 64).toString('hex')
const opts = { flag: 'wx', mode: 0o600 }
writeFileSync(verifier, JSON.stringify({ salt: salt.toString('hex'), hash }), opts)
writeFileSync(login, `站主访客地图\n\n入口：https://fansicheng.online/owner/visitors\n访问密码：${password}\n\n此密码仅供站主使用，请勿分享。\n`, opts)
