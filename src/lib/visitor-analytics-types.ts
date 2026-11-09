export type VisitorSource = 'main' | 'pages'
export type VisitorSite = 'all' | VisitorSource
export type VisitorDays = 7 | 30 | 90
export type VisitorFilter = { site: VisitorSite; days: VisitorDays }
export type CountryCount = { country: string; views: number }
export type VisitorEvent = { at: string; site: VisitorSource; country: string | null }

export interface VisitorReport extends VisitorFilter {
  timezone: 'Asia/Shanghai'
  trackingSince: string
  daily: { date: string; views: number }[]
  countries: CountryCount[]
  totalViews: number
  unknownViews: number
  sites: Record<VisitorSource, number>
  recent: VisitorEvent[]
  legacyUnattributed: { views: number; visitors: number }
  // In this legacy section only, counts mean networks known to have visited '/'.
  // The legacy records contain neither per-page counts nor source domains.
  legacyHome: { countries: CountryCount[]; unknownViews: number; totalViews: number }
}
