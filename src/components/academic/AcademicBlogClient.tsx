'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Tag, Calendar } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import type { PostMeta } from '@/lib/mdx'

interface AcademicBlogClientProps {
  zhPosts: PostMeta[]
  enPosts: PostMeta[]
  allTags: string[]
}

export function AcademicBlogClient({ zhPosts, enPosts, allTags }: AcademicBlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { language } = useLanguage()

  const allPosts = language === 'zh' ? zhPosts : enPosts

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesTag = !selectedTag || post.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [allPosts, searchQuery, selectedTag])

  const texts = {
    title: language === 'zh' ? '博客' : 'Blog',
    subtitle: language === 'zh'
      ? '技术文章、研究笔记与思考。'
      : 'Technical articles, research notes, and thoughts.',
    search: language === 'zh' ? '搜索文章…' : 'Search posts…',
    tags: language === 'zh' ? '标签' : 'Tags',
    all: language === 'zh' ? '全部' : 'All',
    noResults: language === 'zh' ? '未找到相关文章' : 'No posts found',
    results: language === 'zh' ? `共 ${filteredPosts.length} 篇` : `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}`,
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{texts.title}</h1>
          <p className="text-slate-500">{texts.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={texts.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {texts.tags}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    selectedTag === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {texts.all}
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Post list */}
          <main className="lg:col-span-3">
            <div className="text-sm text-slate-500 mb-5">{texts.results}</div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>{texts.noResults}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <article key={post.slug} className="py-6 first:pt-0">
                    <Link href={`/blog/${post.slug}`} className="group">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString(
                            language === 'zh' ? 'zh-CN' : 'en-US',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )}
                        </span>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
