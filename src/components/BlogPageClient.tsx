'use client'

import { useTheme } from '@/lib/theme'
import { AcademicBlogClient } from '@/components/academic/AcademicBlogClient'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Tag, ChevronDown } from 'lucide-react'
import { BlogCard } from '@/components/BlogCard'
import { SectionHeader } from '@/components/SectionHeader'
import { useLanguage } from '@/lib/i18n'
import type { PostMeta } from '@/lib/mdx'

interface BlogPageClientProps {
  zhPosts: PostMeta[]
  enPosts: PostMeta[]
  allTags: string[]
}

export function BlogPageClient({ zhPosts, enPosts, allTags }: BlogPageClientProps) {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'readingTime'>('date')
  const [showFilters, setShowFilters] = useState(false)
  const { language, t } = useLanguage()

  const allPosts = useMemo(() => {
    return language === 'zh' ? zhPosts : enPosts
  }, [language, zhPosts, enPosts])

  const filteredPosts = useMemo(() => {
    return allPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesTag = !selectedTag || post.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return parseInt(b.readingTime) - parseInt(a.readingTime)
    })
  }, [allPosts, searchQuery, selectedTag, sortBy])

  const featuredPost = filteredPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => post.slug !== featuredPost?.slug)

  if (theme === 'academic') {
    return <AcademicBlogClient zhPosts={zhPosts} enPosts={enPosts} allTags={allTags} />
  }

  const texts = {
    title: 'BLOG',
    subtitle: language === 'zh'
      ? '技术文章、开发心得与思考。探索编程的深度与广度。'
      : 'Technical articles, development insights, and thoughts.',
    searchPlaceholder: language === 'zh' ? '搜索文章...' : 'Search posts...',
    filters: language === 'zh' ? '筛选' : 'Filters',
    filterByTag: language === 'zh' ? '按标签筛选' : 'Filter by Tag',
    sortBy: language === 'zh' ? '排序方式' : 'Sort By',
    latest: language === 'zh' ? '最新' : 'Latest',
    readingTime: language === 'zh' ? '阅读时间' : 'Reading Time',
    postsFound: language === 'zh' ? '篇文章' : 'posts found',
    in: language === 'zh' ? '在' : 'in',
    noPostsFound: language === 'zh' ? '未找到文章' : 'No posts found',
    tryAdjusting: language === 'zh' ? '尝试调整搜索或筛选条件' : 'Try adjusting your search or filters',
    all: language === 'zh' ? '全部' : 'All',
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={texts.title} subtitle={texts.subtitle} />

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-gray" />
              <input
                type="text"
                placeholder={texts.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cyber-input"
                style={{ paddingLeft: '48px' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all ${
                showFilters || selectedTag
                  ? 'border border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                  : 'border border-cyber-gray/30 text-cyber-gray hover:border-cyber-cyan/50 hover:text-cyber-cyan'
              }`}
            >
              <Filter className="w-4 h-4" />
              {texts.filters}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="cyber-card mb-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="flex items-center gap-2 font-mono text-sm text-cyber-cyan mb-3">
                    <Tag className="w-4 h-4" />
                    {texts.filterByTag}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`cyber-tag cursor-pointer ${!selectedTag ? 'bg-cyber-cyan/20 border-cyber-cyan' : ''}`}
                    >
                      {texts.all}
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={`cyber-tag cursor-pointer ${tag === selectedTag ? 'bg-cyber-cyan/20 border-cyber-cyan' : ''}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-mono text-sm text-cyber-pink mb-3">
                    <Calendar className="w-4 h-4" />
                    {texts.sortBy}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('date')}
                      className={`cyber-tag cursor-pointer ${sortBy === 'date' ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink' : ''}`}
                    >
                      {texts.latest}
                    </button>
                    <button
                      onClick={() => setSortBy('readingTime')}
                      className={`cyber-tag cursor-pointer ${sortBy === 'readingTime' ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink' : ''}`}
                    >
                      {texts.readingTime}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="font-mono text-sm text-cyber-gray">
            <span className="text-cyber-cyan">{filteredPosts.length}</span> {texts.postsFound}
            {selectedTag && (
              <span> {texts.in} <span className="text-cyber-pink">{selectedTag}</span></span>
            )}
          </div>
        </div>

        {/* Posts */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-8">
            {featuredPost && (
              <div className="mb-8">
                <BlogCard {...featuredPost} featured={true} />
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {regularPosts.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-10 h-10 text-cyber-gray mx-auto mb-4" />
            <h3 className="font-display text-xl text-cyber-white mb-2">{texts.noPostsFound}</h3>
            <p className="text-cyber-gray font-mono">{texts.tryAdjusting}</p>
          </div>
        )}
      </div>
    </div>
  )
}
