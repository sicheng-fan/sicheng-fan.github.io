'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Twitter, Linkedin, Globe, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { AcademicBlogPostClient } from '@/components/academic/AcademicBlogPostClient'
import type { BlogPostData } from '@/lib/mdx'
import { blogPostPath, formatPostDate, formatReadingTime } from '@/lib/blog-display'
import { BlogDocumentMetadata } from '@/components/BlogDocumentMetadata'
interface BlogPostClientProps {
  slug: string
  zhPost: BlogPostData | null
  enPost: BlogPostData | null
}

export function BlogPostClient({ slug, zhPost, enPost }: BlogPostClientProps) {
  const { theme } = useTheme()
  const { language, setLanguage } = useLanguage()

  // All hooks must be called unconditionally
  const post = useMemo(() => {
    if (language === 'zh') {
      return zhPost || enPost
    }
    return enPost || zhPost
  }, [language, zhPost, enPost])

  const isUsingFallback = useMemo(() => {
    if (language === 'zh' && !zhPost && enPost) return true
    if (language === 'en' && !enPost && zhPost) return true
    return false
  }, [language, zhPost, enPost])

  const hasBothLanguages = zhPost && enPost

  if (theme === 'academic') {
    return <AcademicBlogPostClient slug={slug} zhPost={zhPost} enPost={enPost} />
  }

  if (!post) {
    return null
  }

  const toc = post.toc
  const shareUrl = `https://sicheng-fan.github.io${blogPostPath(slug, post.lang)}`

  // 翻译文本
  const texts = {
    backToBlog: language === 'zh' ? '返回博客' : 'Back to Blog',
    tableOfContents: language === 'zh' ? '目录' : 'Table of Contents',
    tags: language === 'zh' ? '标签' : 'Tags',
    shareThisPost: language === 'zh' ? '分享文章' : 'Share this post',
    viewProfile: language === 'zh' ? '查看简介 →' : 'View Profile →',
    fallbackNotice: language === 'zh' 
      ? '该文章暂无中文版本，显示英文版本'
      : 'This article is not available in English, showing Chinese version',
    switchTo: language === 'zh' ? '切换到英文版' : 'Switch to Chinese',
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <BlogDocumentMetadata title={post.meta.title} excerpt={post.meta.excerpt} />
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-cyber-gray hover:text-cyber-cyan transition-colors font-mono text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {texts.backToBlog}
          </Link>
        </div>

        {/* 语言回退提示 */}
        {isUsingFallback && (
          <div className="mb-6 p-4 bg-cyber-orange/10 border border-cyber-orange/30 rounded flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-cyber-orange flex-shrink-0" />
            <span className="text-cyber-orange text-sm font-mono">{texts.fallbackNotice}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Main Content */}
          <article className="min-w-0">
            {/* Header */}
            <header className="mb-12">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.meta.tags.map((tag: string) => (
                  <span key={tag} className="cyber-tag">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 lang={post.lang === 'zh' ? 'zh-CN' : 'en'} className="font-display text-3xl md:text-4xl font-bold text-cyber-white mb-6 break-words">
                {post.meta.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-cyber-gray">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.meta.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatPostDate(post.meta.date, language)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatReadingTime(post.meta.readingTime, language)}
                </span>
                {/* 语言版本指示器 */}
                {hasBothLanguages && (
                  <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} className="flex items-center gap-1 text-cyber-cyan">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs">{language === 'zh' ? 'Read in English' : '阅读中文版'}</span>
                  </button>
                )}
              </div>
            </header>

            {toc.length > 0 && (
              <details className="lg:hidden mb-8 border border-cyber-gray/30 rounded-lg p-4">
                <summary className="cursor-pointer text-cyber-cyan">{texts.tableOfContents}</summary>
                <nav aria-label={texts.tableOfContents} className="mt-3 space-y-2">
                  {toc.map(item => <a key={item.id} href={`#${item.id}`} className={`block text-sm text-cyber-gray hover:text-cyber-white ${item.level === 3 ? 'pl-4' : ''}`}>{item.text}</a>)}
                </nav>
              </details>
            )}

            {/* Content */}
            <div 
              lang={post.lang === 'zh' ? 'zh-CN' : 'en'}
              className="blog-content blog-content-cyber"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-cyber-cyan/20">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-cyber-gray">{texts.shareThisPost}</span>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.meta.title)}&url=${encodeURIComponent(shareUrl)}`}
                    aria-label={language === 'zh' ? '分享到 X' : 'Share on X'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-cyber-dark border border-cyber-gray/30 rounded hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    aria-label={language === 'zh' ? '分享到 LinkedIn' : 'Share on LinkedIn'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-cyber-dark border border-cyber-gray/30 rounded hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-8 cyber-card">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-cyber-dark border-2 border-cyber-cyan flex items-center justify-center text-2xl">
                  👨‍💻
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-cyber-white mb-1">
                    {post.meta.author}
                  </h3>
                  <p className="text-cyber-gray text-sm mb-3">
                    Technical Lead @ WebAgentLab · Researcher @ Qwen, Alibaba
                  </p>
                  <Link
                    href="/about"
                    className="text-cyber-cyan hover:text-cyber-cyan transition-colors font-mono text-sm"
                  >
                    {texts.viewProfile}
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="cyber-card">
                  <h3 className="font-display text-sm font-bold text-cyber-cyan uppercase tracking-wider mb-4">
                    {texts.tableOfContents}
                  </h3>
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm font-mono transition-colors text-cyber-gray hover:text-cyber-white ${
                          item.level === 3 ? 'pl-4' : ''
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Related Tags */}
              <div className="cyber-card">
                <h3 className="font-display text-sm font-bold text-cyber-cyan uppercase tracking-wider mb-4">
                  {texts.tags}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.meta.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="cyber-tag hover:bg-cyber-cyan/20"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Language Version Indicator */}
              {hasBothLanguages && (
                <div className="cyber-card">
                  <h3 className="font-display text-sm font-bold text-cyber-cyan uppercase tracking-wider mb-4">
                    <Globe className="w-4 h-4 inline mr-2" />
                    {language === 'zh' ? '语言版本' : 'Language'}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => setLanguage('zh')} aria-pressed={post.lang === 'zh'} className={`px-3 py-1 text-xs font-mono rounded ${
                      post.lang === 'zh' 
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan' 
                        : 'bg-cyber-dark text-cyber-gray border border-cyber-gray/30'
                    }`}>
                      中文
                    </button>
                    <button onClick={() => setLanguage('en')} aria-pressed={post.lang === 'en'} className={`px-3 py-1 text-xs font-mono rounded ${
                      post.lang === 'en' 
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan' 
                        : 'bg-cyber-dark text-cyber-gray border border-cyber-gray/30'
                    }`}>
                      English
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
