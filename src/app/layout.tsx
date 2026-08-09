import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/i18n'
import { ThemeProvider } from '@/lib/theme'
import { LayoutClient } from '@/components/LayoutClient'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fan Sicheng | Researcher',
  description: 'Personal academic website of Sicheng Fan — GUI agent and computer-use agent researcher in the Alibaba Qwen foundation model team.',
  keywords: ['GUI Agent', 'Computer-Use Agent', 'Reinforcement Learning', 'Qwen', 'Fudan University', '范思诚'],
  authors: [{ name: 'Fan Sicheng' }],
  openGraph: {
    title: 'Fan Sicheng | Researcher',
    description: 'Personal academic website of Sicheng Fan — GUI agent and computer-use agent researcher in the Alibaba Qwen foundation model team.',
    url: 'https://fansicheng.online',
    siteName: 'Fan Sicheng',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@400;500;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider>
            <LayoutClient>
              {children}
            </LayoutClient>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
