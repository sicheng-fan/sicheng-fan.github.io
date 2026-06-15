'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Terminal, Folder, User, Clock, Home, Rss, Search, FileText, ExternalLink, Loader2, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

// 搜索结果类型
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
  const [currentTime, setCurrentTime] = useState('')
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

  // 执行搜索
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
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // 防抖搜索
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value)
    }, 300)
  }, [performSearch])

  // 导航到搜索结果
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

  // 关闭搜索时重置状态
  const closeSearch = useCallback(() => {
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
    setSelectedIndex(0)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 搜索框打开时的键盘处理
      if (showSearch) {
        if (e.key === 'Escape') {
          e.preventDefault()
          closeSearch()
          return
        }
        
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((prev) => 
            prev < searchResults.length - 1 ? prev + 1 : 0
          )
          return
        }
        
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : searchResults.length - 1
          )
          return
        }
        
        if (e.key === 'Enter' && searchResults.length > 0) {
          e.preventDefault()
          navigateToResult(searchResults[selectedIndex])
          return
        }
      }

      // 全局快捷键
      if (e.ctrlKey || e.metaKey) {
        const item = navItems.find(i => i.shortcut.toLowerCase() === e.key.toLowerCase())
        if (item) {
          e.preventDefault()
          window.location.href = item.href
        }
        if (e.key === 'k') {
          e.preventDefault()
          setShowSearch(true)
        }
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSearch, searchResults, selectedIndex, navigateToResult, closeSearch, navItems])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-green/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Terminal className="w-8 h-8 text-cyber-green transition-all group-hover:text-cyber-cyan" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-lg font-bold text-cyber-green tracking-wider">
                  FAN<span className="text-cyber-cyan">.</span>SICHENG
                </span>
                <div className="text-[10px] font-mono text-cyber-gray tracking-widest">
                  DIGITAL_SPACE v1.0
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 font-mono text-sm tracking-wider transition-all group ${
                      isActive
                        ? 'text-cyber-green'
                        : 'text-cyber-gray hover:text-cyber-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-green"
                        initial={false}
                      />
                    )}
                    {/* Hover effect */}
                    <span className="absolute inset-0 bg-cyber-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Academic mode toggle */}
              <button
                onClick={() => setTheme('academic')}
                className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-cyber-dark/50 border border-cyber-gray/30 rounded text-cyber-gray hover:text-cyber-white hover:border-cyber-white/50 transition-all font-mono text-xs"
                title="Switch to Academic Theme"
              >
                📄 <span className="hidden md:inline">ACADEMIC</span>
              </button>

              {/* Language toggle button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-cyber-dark/50 border border-cyber-gray/30 rounded text-cyber-gray hover:text-cyber-green hover:border-cyber-green/50 transition-all font-mono text-sm"
                title={language === 'zh' ? 'Switch to English' : '切换到中文'}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'zh' ? 'EN' : '中文'}</span>
              </button>

              {/* Time display */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-cyber-dark/50 border border-cyber-green/20 rounded font-mono text-sm">
                <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                <span className="text-cyber-green">{currentTime}</span>
              </div>

              {/* Search button */}
              <button
                onClick={() => setShowSearch(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cyber-dark/50 border border-cyber-gray/30 rounded text-cyber-gray hover:text-cyber-white hover:border-cyber-green/50 transition-all font-mono text-sm"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">{t.nav.search}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-cyber-darker rounded">⌘K</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-cyber-gray hover:text-cyber-green transition-colors"
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
              className="lg:hidden bg-cyber-darker/98 backdrop-blur-md border-b border-cyber-green/20"
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
                      className={`flex items-center gap-3 px-4 py-3 rounded font-mono text-sm tracking-wider transition-all ${
                        isActive
                          ? 'bg-cyber-green/10 text-cyber-green border-l-2 border-cyber-green'
                          : 'text-cyber-gray hover:bg-cyber-dark hover:text-cyber-white'
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
            className="fixed inset-0 z-50 bg-cyber-black/80 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
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
                  <span className="ml-4 font-mono text-sm text-cyber-gray">search.exe</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 text-cyber-green animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 text-cyber-green" />
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
                      className="text-cyber-gray font-mono text-sm hover:text-cyber-green transition-colors px-2 py-1 border border-cyber-gray/30 rounded hover:border-cyber-green/50"
                    >
                      ESC
                    </button>
                  </div>

                  {/* 搜索结果 */}
                  {searchResults.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-cyber-green/20 max-h-[50vh] overflow-y-auto">
                      <div className="text-cyber-gray text-xs font-mono mb-3">
                        {t.nav.found} <span className="text-cyber-green">{searchResults.length}</span> {t.nav.results}
                      </div>
                      <div className="space-y-2">
                        {searchResults.map((result, index) => (
                          <button
                            key={`${result.type}-${result.url}`}
                            onClick={() => navigateToResult(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full text-left p-3 rounded transition-all group ${
                              index === selectedIndex
                                ? 'bg-cyber-green/10 border border-cyber-green/50'
                                : 'bg-cyber-dark/50 border border-transparent hover:border-cyber-green/30'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 ${
                                result.type === 'post' ? 'text-cyber-cyan' : 'text-cyber-orange'
                              }`}>
                                {result.type === 'post' ? (
                                  <FileText className="w-4 h-4" />
                                ) : (
                                  <Folder className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono text-sm ${
                                    index === selectedIndex ? 'text-cyber-green' : 'text-cyber-white'
                                  }`}>
                                    {result.title}
                                  </span>
                                  {result.url.startsWith('http') && (
                                    <ExternalLink className="w-3 h-3 text-cyber-gray" />
                                  )}
                                </div>
                                <p className="text-cyber-gray text-xs mt-1 line-clamp-2">
                                  {result.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                                    result.type === 'post' 
                                      ? 'bg-cyber-cyan/20 text-cyber-cyan' 
                                      : 'bg-cyber-orange/20 text-cyber-orange'
                                  }`}>
                                    {result.type === 'post' ? t.nav.post : t.nav.project}
                                  </span>
                                  {result.date && (
                                    <span className="text-[10px] text-cyber-gray font-mono">
                                      {result.date}
                                    </span>
                                  )}
                                  {result.tags.slice(0, 3).map((tag) => (
                                    <span 
                                      key={tag}
                                      className="text-[10px] px-1.5 py-0.5 bg-cyber-dark rounded text-cyber-gray font-mono"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 无搜索结果 */}
                  {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                    <div className="mt-4 pt-4 border-t border-cyber-green/20">
                      <div className="text-center py-8">
                        <Search className="w-8 h-8 text-cyber-gray mx-auto mb-2" />
                        <div className="text-cyber-gray font-mono text-sm">
                          {t.nav.noResults} &quot;<span className="text-cyber-orange">{searchQuery}</span>&quot; {t.nav.relatedResults}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 搜索提示 */}
                  {searchQuery.length < 2 && (
                    <div className="mt-4 pt-4 border-t border-cyber-green/20">
                      <div className="text-cyber-gray text-sm font-mono">
                        <span className="text-cyber-green">TIP:</span> {t.nav.searchTip}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs text-cyber-gray font-mono">{language === 'zh' ? '快捷键:' : 'Shortcuts:'}</span>
                        <span className="text-xs px-2 py-0.5 bg-cyber-dark rounded font-mono text-cyber-cyan">↑↓ {language === 'zh' ? '选择' : 'Select'}</span>
                        <span className="text-xs px-2 py-0.5 bg-cyber-dark rounded font-mono text-cyber-cyan">Enter {language === 'zh' ? '确认' : 'Confirm'}</span>
                        <span className="text-xs px-2 py-0.5 bg-cyber-dark rounded font-mono text-cyber-cyan">ESC {language === 'zh' ? '关闭' : 'Close'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  )
}
