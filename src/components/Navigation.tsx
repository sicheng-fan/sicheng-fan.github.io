'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Folder, User, Clock, Home, Rss, Search, FileText, ExternalLink, Loader2, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

interface SearchResult {
  type: 'post' | 'project'
  title: string
  description: string
  url: string
  tags: string[]
  date?: string
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { language, toggleLanguage, t } = useLanguage()
  const { setTheme } = useTheme()

  const navItems = useMemo(() => [
    { href: '/', label: t.nav.home, icon: Home, shortcut: 'H' },
    { href: '/blog', label: t.nav.blog, icon: Rss, shortcut: 'B' },
    { href: '/projects', label: t.nav.projects, icon: Folder, shortcut: 'P' },
    { href: '/timeline', label: t.nav.timeline, icon: Clock, shortcut: 'T' },
    { href: '/about', label: t.nav.about, icon: User, shortcut: 'A' },
  ], [t.nav.home, t.nav.blog, t.nav.projects, t.nav.timeline, t.nav.about])

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.results || [])
      setSelectedIndex(0)
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => performSearch(value), 300)
  }, [performSearch])

  const navigateToResult = useCallback((result: SearchResult) => {
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
    if (result.url.startsWith('http')) {
      window.open(result.url, '_blank')
    } else {
      router.push(result.url)
    }
  }, [router])

  const closeSearch = useCallback(() => {
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
    setSelectedIndex(0)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSearch) {
        if (e.key === 'Escape') { e.preventDefault(); closeSearch(); return }
        if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(p => p < searchResults.length - 1 ? p + 1 : 0); return }
        if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(p => p > 0 ? p - 1 : searchResults.length - 1); return }
        if (e.key === 'Enter' && searchResults.length > 0) { e.preventDefault(); navigateToResult(searchResults[selectedIndex]); return }
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'k') { e.preventDefault(); setShowSearch(true) }
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSearch, searchResults, selectedIndex, navigateToResult, closeSearch])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'nav-glass-scrolled' : 'nav-glass'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display text-xl font-bold text-gradient-static tracking-wider">
                FSC
              </span>
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse-glow" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 font-mono text-sm tracking-wider transition-all duration-300 rounded-lg ${
                      isActive
                        ? 'text-cyber-cyan bg-cyber-cyan/10'
                        : 'text-cyber-gray hover:text-cyber-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-pink rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Academic mode toggle */}
              <button
                onClick={() => setTheme('academic')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-cyber-gray hover:text-cyber-white hover:bg-cyber-white/5 transition-all font-mono text-xs"
                title="Switch to Academic Theme"
              >
                <span className="text-sm">📄</span>
                <span className="hidden md:inline">ACADEMIC</span>
              </button>

              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-cyber-gray hover:text-cyber-cyan hover:bg-cyber-cyan/5 transition-all font-mono text-sm"
                title={language === 'zh' ? 'Switch to English' : '切换到中文'}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'zh' ? 'EN' : '中文'}</span>
              </button>

              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-cyber-gray hover:text-cyber-white hover:bg-cyber-white/5 transition-all font-mono text-sm"
              >
                <Search className="w-4 h-4" />
                <span className="text-[10px] px-1.5 py-0.5 bg-cyber-dark rounded border border-cyber-gray/20">⌘K</span>
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-cyber-gray hover:text-cyber-cyan transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
              style={{ background: 'rgba(5, 10, 21, 0.97)', backdropFilter: 'blur(20px)' }}
            >
              <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href))

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                        isActive
                          ? 'bg-cyber-cyan/10 text-cyber-cyan'
                          : 'text-cyber-gray hover:bg-cyber-white/5 hover:text-cyber-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
            style={{ background: 'rgba(5, 10, 21, 0.85)', backdropFilter: 'blur(8px)' }}
            onClick={closeSearch}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="ml-4 font-mono text-sm text-cyber-gray">search</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 text-cyber-cyan animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 text-cyber-cyan" />
                    )}
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder={t.nav.searchPlaceholder}
                      className="flex-1 bg-transparent border-none outline-none text-cyber-white font-mono placeholder:text-cyber-gray"
                      autoFocus
                    />
                    <button
                      onClick={closeSearch}
                      className="text-cyber-gray font-mono text-xs hover:text-cyber-cyan transition-colors px-2 py-1 border border-cyber-gray/30 rounded hover:border-cyber-cyan/50"
                    >
                      ESC
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-cyber-cyan/10 max-h-[50vh] overflow-y-auto">
                      <div className="text-cyber-gray text-xs font-mono mb-3">
                        {t.nav.found} <span className="text-cyber-cyan">{searchResults.length}</span> {t.nav.results}
                      </div>
                      <div className="space-y-2">
                        {searchResults.map((result, index) => (
                          <button
                            key={`${result.type}-${result.url}`}
                            onClick={() => navigateToResult(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              index === selectedIndex
                                ? 'bg-cyber-cyan/10 border border-cyber-cyan/30'
                                : 'border border-transparent hover:bg-cyber-white/5'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 ${result.type === 'post' ? 'text-cyber-cyan' : 'text-cyber-pink'}`}>
                                {result.type === 'post' ? <FileText className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono text-sm ${index === selectedIndex ? 'text-cyber-cyan' : 'text-cyber-white'}`}>
                                    {result.title}
                                  </span>
                                  {result.url.startsWith('http') && <ExternalLink className="w-3 h-3 text-cyber-gray" />}
                                </div>
                                <p className="text-cyber-gray text-xs mt-1 line-clamp-2">{result.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                                    result.type === 'post' ? 'bg-cyber-cyan/10 text-cyber-cyan' : 'bg-cyber-pink/10 text-cyber-pink'
                                  }`}>
                                    {result.type === 'post' ? t.nav.post : t.nav.project}
                                  </span>
                                  {result.date && <span className="text-[10px] text-cyber-gray font-mono">{result.date}</span>}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                    <div className="mt-4 pt-4 border-t border-cyber-cyan/10 text-center py-8">
                      <Search className="w-8 h-8 text-cyber-gray mx-auto mb-2" />
                      <div className="text-cyber-gray font-mono text-sm">
                        {t.nav.noResults} &quot;<span className="text-cyber-pink">{searchQuery}</span>&quot; {t.nav.relatedResults}
                      </div>
                    </div>
                  )}

                  {searchQuery.length < 2 && (
                    <div className="mt-4 pt-4 border-t border-cyber-cyan/10">
                      <div className="text-cyber-gray text-sm font-mono">
                        <span className="text-cyber-cyan">TIP:</span> {t.nav.searchTip}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
