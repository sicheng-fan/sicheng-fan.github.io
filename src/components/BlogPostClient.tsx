'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Twitter, Linkedin, Globe, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { AcademicBlogPostClient } from '@/components/academic/AcademicBlogPostClient'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface PostData {
  slug: string
  lang: string
  hasZh: boolean
  hasEn: boolean
  meta: {
    title: string
    excerpt: string
    date: string
    readingTime: string
    tags: string[]
    featured?: boolean
    coverImage?: string
    author?: string
  }
  content: string
}

interface BlogPostClientProps {
  slug: string
  zhPost: PostData | null
  enPost: PostData | null
}

// 渲染 LaTeX 数学公式
function renderMath(text: string): string {
  // 先处理块级公式 $$...$$
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
      })
    } catch (e) {
      console.error('KaTeX block error:', e)
      return match
    }
  })
  
  // 再处理行内公式 $...$（需要避免匹配到 $$）
  text = text.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
      })
    } catch (e) {
      console.error('KaTeX inline error:', e)
      return match
    }
  })
  
  return text
}

// 简单的 Markdown 转 HTML
function markdownToHtml(markdown: string): string {
  let result = renderMath(markdown)
  
  return result
    // 标题
    .replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 代码块
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre data-language="$1"><code>$2</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 粗体
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // 无序列表
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // 有序列表
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // 表格处理
    .replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim())
      if (cells.every((cell: string) => cell.match(/^-+$/))) {
        return ''
      }
      const cellHtml = cells.map((cell: string) => `<td>${cell}</td>`).join('')
      return `<tr>${cellHtml}</tr>`
    })
    // 段落
    .replace(/\n\n/g, '</p><p>')
    // 换行
    .replace(/\n/g, '<br/>')
    // 包装段落
    .replace(/^([^<].+)$/gm, '<p>$1</p>')
    // 清理多余的 p 标签
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-3])/g, '$1')
    .replace(/(<\/h[1-3]>)<\/p>/g, '$1')
    .replace(/<p>(<pre)/g, '$1')
    .replace(/(<\/pre>)<\/p>/g, '$1')
    .replace(/<p>(<li>)/g, '$1')
    .replace(/(<\/li>)<\/p>/g, '$1')
    .replace(/<p>(<tr>)/g, '$1')
    .replace(/(<\/tr>)<\/p>/g, '$1')
}

// 生成目录
function generateToc(content: string) {
  const headings = content.match(/^#{2,3}\s.+$/gm) || []
  return headings.map((heading) => {
    const level = heading.match(/^#+/)?.[0].length || 2
    const text = heading.replace(/^#+\s/, '')
    const id = text
    return { id, text, level }
  })
}

export function BlogPostClient({ slug, zhPost, enPost }: BlogPostClientProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()

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

  const toc = generateToc(post.content)
  const htmlContent = markdownToHtml(post.content)

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
              <h1 className="font-display text-3xl md:text-4xl font-bold text-cyber-white mb-6">
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
                  {post.meta.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.meta.readingTime}
                </span>
                {/* 语言版本指示器 */}
                {hasBothLanguages && (
                  <span className="flex items-center gap-1 text-cyber-cyan">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs">ZH | EN</span>
                  </span>
                )}
              </div>
            </header>

            {/* Content */}
            <div 
              className="mdx-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-cyber-cyan/20">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-cyber-gray">{texts.shareThisPost}</span>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.meta.title)}&url=${encodeURIComponent(`https://fansicheng.online/blog/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-cyber-dark border border-cyber-gray/30 rounded hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://fansicheng.online/blog/${slug}`)}`}
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
                      href={`/blog?tag=${tag}`}
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
                    <span className={`px-3 py-1 text-xs font-mono rounded ${
                      post.lang === 'zh' 
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan' 
                        : 'bg-cyber-dark text-cyber-gray border border-cyber-gray/30'
                    }`}>
                      中文
                    </span>
                    <span className={`px-3 py-1 text-xs font-mono rounded ${
                      post.lang === 'en' 
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan' 
                        : 'bg-cyber-dark text-cyber-gray border border-cyber-gray/30'
                    }`}>
                      English
                    </span>
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
