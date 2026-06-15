'use client'

import { useTheme } from '@/lib/theme'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { MatrixRain } from '@/components/MatrixRain'
import { AnalyticsTracker } from '@/components/Analytics'
import { AcademicNav } from '@/components/academic/AcademicNav'
import { AcademicFooter } from '@/components/academic/AcademicFooter'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  if (theme === 'academic') {
    return (
      <div className="flex flex-col min-h-screen bg-white text-slate-900 antialiased">
        <AnalyticsTracker />
        <AcademicNav />
        <main className="flex-grow">{children}</main>
        <AcademicFooter />
      </div>
    )
  }

  return (
    <div className="bg-cyber-black text-cyber-white min-h-screen antialiased">
      {/* Background layers */}
      <div className="fixed inset-0 z-0">
        <MatrixRain />
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Soft vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,10,21,0.8) 100%)',
        }} />
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <AnalyticsTracker />
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
