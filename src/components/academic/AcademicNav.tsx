'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Globe, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

export function AcademicNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { language, toggleLanguage } = useLanguage()
  const { setTheme } = useTheme()

  const navItems = [
    { href: '/', label: language === 'zh' ? '主页' : 'Home' },
    { href: '/about', label: language === 'zh' ? '关于' : 'About' },
    { href: '/projects', label: language === 'zh' ? '研究与项目' : 'Research & Projects' },
    { href: '/blog', label: language === 'zh' ? '博客' : 'Blog' },
    { href: '/timeline', label: language === 'zh' ? '经历' : 'Timeline' },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Name */}
          <Link href="/" className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm sm:text-base">
            Fan Sicheng
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
              title={language === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'zh' ? 'EN' : '中文'}</span>
            </button>

            <button
              onClick={() => setTheme('cyber')}
              className="flex items-center gap-1 px-2 py-1 text-xs font-mono rounded border border-slate-200 text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Switch to Cyber Theme"
            >
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">CYBER</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-sm">
          <nav className="max-w-5xl mx-auto px-4 py-2 flex flex-col gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded text-sm ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
