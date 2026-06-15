'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag, Globe } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
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

interface AcademicBlogPostClientProps {
  slug: string
  zhPost: PostData | null
  enPost: PostData | null
}

function renderContent(content: string): string {
  let html = content

  // Render block math
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      return `<div class="katex-block my-4">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`
    } catch {
      return `<div class="bg-red-50 text-red-600 p-2 rounded text-sm">Math error: ${math}</div>`
    }
  })

  // Render inline math
  html = html.replace(/\$([^$\n]+)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false })
    } catch {
      return `<span class="text-red-600">${math}</span>`
    }
  })

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto my-4 text-sm"><code class="language-${lang}">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-slate-900 mt-10 mb-4">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-slate-900 mt-10 mb-4">$1</h1>')

  // Bold & italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-200 pl-4 py-1 text-slate-600 italic my-4">$1</blockquote>')

  // Lists
  html = html.replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc text-slate-700">$1</li>')
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-700">$1</li>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-700">$1</li>')

  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (para.trim().startsWith('<')) return para
    if (!para.trim()) return ''
    return `<p class="text-slate-700 leading-relaxed my-4">${para.replace(/\n/g, ' ')}</p>`
  }).join('\n')

  return html
}

export function AcademicBlogPostClient({ slug, zhPost, enPost }: AcademicBlogPostClientProps) {
  const { language, setLanguage } = useLanguage()

  const post = useMemo(() => {
    if (language === 'zh' && zhPost) return zhPost
    if (language === 'en' && enPost) return enPost
    return zhPost || enPost
  }, [language, zhPost, enPost])

  const renderedContent = useMemo(() => {
    if (!post?.content) return ''
    return renderContent(post.content)
  }, [post?.content])

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

  const hasOtherLang = (language === 'zh' && enPost) || (language === 'en' && zhPost)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
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

        {/* Content */}
        <div
          className="prose-academic max-w-none text-slate-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {language === 'zh' ? '返回博客列表' : 'Back to all posts'}
          </Link>
        </div>
      </div>
    </div>
  )
}
