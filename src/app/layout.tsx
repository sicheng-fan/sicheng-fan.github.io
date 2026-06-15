import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/i18n'
import { ThemeProvider } from '@/lib/theme'
import { LayoutClient } from '@/components/LayoutClient'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fan Sicheng | Researcher',
  description: 'Personal academic website of Fan Sicheng — GUI Agent & RL researcher at Fudan University and Qwen, Alibaba Group.',
  keywords: ['GUI Agent', 'Reinforcement Learning', 'AI Researcher', 'Fudan University', 'Qwen', 'Alibaba', '范思诚'],
  authors: [{ name: 'Fan Sicheng' }],
  openGraph: {
    title: 'Fan Sicheng | Researcher',
    description: 'Personal academic website of Fan Sicheng — GUI Agent & RL researcher at Fudan University and Qwen, Alibaba Group.',
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
