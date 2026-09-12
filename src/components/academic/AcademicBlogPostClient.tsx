'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag, Globe } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import type { BlogPostData } from '@/lib/mdx'
interface AcademicBlogPostClientProps {
  slug: string
  zhPost: BlogPostData | null
  enPost: BlogPostData | null
}

export function AcademicBlogPostClient({ slug, zhPost, enPost }: AcademicBlogPostClientProps) {
  const { language, setLanguage } = useLanguage()

  const post = useMemo(() => {
    if (language === 'zh' && zhPost) return zhPost
    if (language === 'en' && enPost) return enPost
    return zhPost || enPost
  }, [language, zhPost, enPost])

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">{language === 'zh' ? '文章未找到' : 'Post not found'}</p>
          <Link href="/blog" className="text-blue-600 hover:underline">
            {language === 'zh' ? '返回博客' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    )
  }

  const isUsingFallback = post.lang !== language
  const hasOtherLang = (language === 'zh' && enPost) || (language === 'en' && zhPost)

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {language === 'zh' ? '返回博客' : 'Back to Blog'}
        </Link>

        {/* Header */}
        <header className="mb-10 pb-8 border-b border-slate-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.meta.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
            {post.meta.title}
          </h1>

          {post.meta.excerpt && (
            <p className="text-lg text-slate-600 leading-relaxed mb-5">{post.meta.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.meta.date).toLocaleDateString(
                language === 'zh' ? 'zh-CN' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.meta.readingTime}
            </span>
            {post.meta.author && (
              <span>{post.meta.author}</span>
            )}
            {hasOtherLang && (
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors ml-auto"
              >
                <Globe className="w-4 h-4" />
                {language === 'zh' ? 'Read in English' : '阅读中文版'}
              </button>
            )}
          </div>
        </header>

        {isUsingFallback && (
          <p role="status" className="mb-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            {language === 'zh' ? '该文章暂无中文版本，显示英文原文。' : 'An English translation is not available yet. Showing the Chinese original.'}
          </p>
        )}

        {/* Content */}
        <div
          lang={post.lang === 'zh' ? 'zh-CN' : 'en'}
          className="blog-content blog-content-academic"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {language === 'zh' ? '返回博客列表' : 'Back to all posts'}
          </Link>
        </div>
      </article>
    </div>
  )
}
