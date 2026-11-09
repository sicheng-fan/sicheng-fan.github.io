import { readFileSync } from 'node:fs'
import { isIP } from 'node:net'
import path from 'node:path'
import { gunzipSync } from 'node:zlib'

// Return canonical bytes only for public Internet addresses. These bytes are
// used in memory for the lookup; neither addresses nor derived IDs are saved.
export function publicNetwork(address: string): Buffer | null {
  const addr = address.trim()
  if (addr.includes('%')) return null
  if (isIP(addr) === 6) {
    // URL normalizes dotted IPv4 tails and IPv6 spelling without a DNS lookup.
    const [before, after] = new URL('http://[' + addr + ']').hostname.slice(1, -1).split('::')
    const left = before ? before.split(':') : []
    const right = after ? after.split(':') : []
    const groups = [...left, ...Array(8 - left.length - right.length).fill('0'), ...right]
    const bytes = Buffer.alloc(16)
    groups.forEach((group, i) => bytes.writeUInt16BE(parseInt(group, 16), i * 2))
    if (bytes.subarray(0, 12).equals(Buffer.from('00000000000000000000ffff', 'hex'))) {
      return publicNetwork(Array.from(bytes.subarray(12)).join('.'))
    }
    const prefix = bytes.readUInt32BE(0)
    if ((bytes[0] & 0xe0) !== 0x20 || prefix === 0x20010db8 ||
        ((prefix >>> 12) === 0x3fff0) || (prefix === 0x20010002 && bytes.readUInt16BE(4) === 0)) return null
    return bytes
  }
  if (isIP(addr) !== 4) return null
  const bytes = Buffer.from(addr.split('.').map(Number))
  const [a, b, c] = Array.from(bytes)
  if (a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 168 || (b === 0 && (c === 0 || c === 2)) || (b === 88 && c === 99))) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113)) return null
  return bytes
}

let index: { bytes: Buffer; v4: number; v6: number } | undefined

function countryIndex() {
  if (!index) {
    const bytes = gunzipSync(readFileSync(path.join(process.cwd(), 'resources/geoip/country.bin.gz')))
    const v4 = bytes.readUInt32BE(4)
    const v6 = bytes.readUInt32BE(8)
    if (bytes.toString('ascii', 0, 4) !== 'DBC1' || !v4 || !v6 || bytes.length !== 12 + 6*v4 + 18*v6) {
      throw new Error('Invalid offline country index')
    }
    index = { bytes, v4, v6 }
  }
  return index
}

export function countryForNetwork(network: Buffer | null): string | null {
  if (!network) return null
  const { bytes, v4, v6 } = countryIndex()
  const width = network.length
  const offset = width === 4 ? 12 : 12 + 6*v4
  const stride = width + 2
  let lo = 0
  let hi = width === 4 ? v4 : v6
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2)
    const start = offset + stride*mid
    if (bytes.compare(network, 0, width, start, start + width) <= 0) lo = mid + 1
    else hi = mid
  }
  if (lo === 0) return null
  const start = offset + (lo - 1)*stride + width
  const country = bytes.toString('ascii', start, start + 2)
  return country === 'ZZ' ? null : country
}
