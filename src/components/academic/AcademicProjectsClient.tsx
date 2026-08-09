'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Github, ExternalLink, Star, GitFork, BookOpen, ChevronDown, ChevronUp, Copy, Check, Code2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { publications, generateBibtex } from '@/data/publications'

interface Project {
  title: string
  description: { zh: string; en: string }
  tags: string[]
  github?: string
  stars?: number
  forks?: number
  status: 'active' | 'wip' | 'archived'
  category: string
  paper?: string
}

interface AcademicProjectsClientProps {
  projects: Project[]
}

function PubCard({ pub, language }: { pub: typeof publications[0]; language: 'zh' | 'en' }) {
  const [showAbstract, setShowAbstract] = useState(false)
  const [showBibtex, setShowBibtex] = useState(false)
  const [copied, setCopied] = useState(false)

  const bibtex = generateBibtex(pub)
  const title = language === 'zh' ? pub.titleZh : pub.title
  const abstract = language === 'zh' ? pub.abstractZh : pub.abstract

  const copyBibtex = async () => {
    await navigator.clipboard.writeText(bibtex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-white hover:shadow-sm transition-all">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold"
            style={{ backgroundColor: pub.venueBg, color: pub.venueColor }}
          >
            {pub.venueShort}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">{title}</h3>
          <p className="text-sm text-slate-600 mb-2">
            {pub.authors.map((author, i) => (
              <span key={author}>
                {author === 'Sicheng Fan'
                  ? <strong className="text-slate-800">{author}</strong>
                  : author}
                {i < pub.authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <p className="text-sm italic text-slate-500 mb-3">{pub.venue}, {pub.year}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {pub.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{tag}</span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={pub.arxivUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              <BookOpen className="w-3 h-3" />
              arXiv:{pub.arxivId}
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            {pub.github && (
              <a href={pub.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                <Github className="w-3 h-3" />
                {language === 'zh' ? '代码' : 'Code'}
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            )}
            <button onClick={() => setShowAbstract(!showAbstract)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              {showAbstract ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {language === 'zh' ? '摘要' : 'Abstract'}
            </button>
            <button onClick={() => setShowBibtex(!showBibtex)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              BibTeX
            </button>
          </div>

          {showAbstract && (
            <div className="mt-3 p-3 bg-slate-50 rounded text-sm text-slate-700 leading-relaxed border border-slate-100">
              {abstract}
            </div>
          )}

          {showBibtex && (
            <div className="mt-3 relative">
              <pre className="p-3 bg-slate-900 text-slate-100 rounded text-xs overflow-x-auto font-mono leading-relaxed">{bibtex}</pre>
              <button onClick={copyBibtex}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AcademicProjectsClient({ projects }: AcademicProjectsClientProps) {
  const { language } = useLanguage()

  const statusLabels = {
    active: { zh: '进行中', en: 'Active', color: 'bg-green-100 text-green-700' },
    wip: { zh: '开发中', en: 'WIP', color: 'bg-amber-100 text-amber-700' },
    archived: { zh: '已归档', en: 'Archived', color: 'bg-slate-100 text-slate-500' },
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {language === 'zh' ? '研究与项目' : 'Research & Projects'}
        </h1>
        <p className="text-slate-500 mb-10">
          {language === 'zh'
            ? '发表论文、开源项目与工具。'
            : 'Published papers, open-source projects, and tools.'}
        </p>

        {/* Publications */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-slate-900 mb-1 pb-2 border-b border-slate-200">
            {language === 'zh' ? '发表论文' : 'Publications'}
          </h2>
          <div className="space-y-4">
            {publications.map((pub) => (
              <PubCard key={pub.id} pub={pub} language={language} />
            ))}
          </div>
        </section>

        {/* Open Source Projects */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-5 pb-2 border-b border-slate-200">
            {language === 'zh' ? '开源项目' : 'Open Source'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.title}
                className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    {proj.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusLabels[proj.status][language === 'zh' ? 'zh' : 'en'] ? '' : ''} ${statusLabels[proj.status].color}`}>
                    {statusLabels[proj.status][language === 'zh' ? 'zh' : 'en']}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {proj.description[language]}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {proj.github && (
                    <a href={proj.github} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors">
                      <Github className="w-3.5 h-3.5" />
                      {language === 'zh' ? '代码' : 'Code'}
                    </a>
                  )}
                  {proj.paper && (
                    <a href={proj.paper} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition-colors">
                      <BookOpen className="w-3.5 h-3.5" />
                      {language === 'zh' ? '论文' : 'Paper'}
                    </a>
                  )}
                  <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
                    {proj.stars !== undefined && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {proj.stars}
                      </span>
                    )}
                    {proj.forks !== undefined && (
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {proj.forks}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a href="https://github.com/sicheng-fan" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              <Github className="w-4 h-4" />
              {language === 'zh' ? '在 GitHub 查看更多' : 'View more on GitHub'}
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
