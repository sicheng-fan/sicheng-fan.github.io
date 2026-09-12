const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || ''

// Static hosting has no write endpoint unless a separate backend is configured.
export const hasAnalyticsBackend = process.env.NEXT_PUBLIC_STATIC_EXPORT !== 'true' || Boolean(apiBaseUrl)

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}
