'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Github, Twitter, Linkedin, Mail, ExternalLink, Copy, Check, ChevronDown, ChevronUp, BookOpen, Code2, GraduationCap, Briefcase } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { publications, generateBibtex } from '@/data/publications'
import { education, experience } from '@/data/profile'

function PublicationCard({ pub, language }: { pub: typeof publications[0]; language: 'zh' | 'en' }) {
  const [showAbstract, setShowAbstract] = useState(false)
  const [showBibtex, setShowBibtex] = useState(false)
  const [copied, setCopied] = useState(false)

  const bibtex = generateBibtex(pub)

  const copyBibtex = async () => {
    await navigator.clipboard.writeText(bibtex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const title = language === 'zh' ? pub.titleZh : pub.title
  const abstract = language === 'zh' ? pub.abstractZh : pub.abstract

  return (
    <div className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
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
          <h3 className="text-base font-semibold text-slate-900 leading-snug mb-2">{title}</h3>
          <p className="text-sm text-slate-600 mb-3">
            {pub.authors.map((author, i) => (
              <span key={author}>
                {author === 'Sicheng Fan' ? (
                  <strong className="text-slate-800">{author}</strong>
                ) : (
                  author
                )}
                {i < pub.authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <p className="text-sm text-slate-500 mb-3 italic">{pub.venue}, {pub.year}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {pub.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <a
              href={pub.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <BookOpen className="w-3 h-3" />
              arXiv
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            {pub.github && (
              <a
                href={pub.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <Code2 className="w-3 h-3" />
                {language === 'zh' ? '代码' : 'Code'}
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            )}
            <button
              onClick={() => setShowAbstract(!showAbstract)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {showAbstract ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {language === 'zh' ? '摘要' : 'Abstract'}
            </button>
            <button
              onClick={() => setShowBibtex(!showBibtex)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              BibTeX
            </button>
          </div>

          {/* Abstract collapse */}
          {showAbstract && (
            <div className="mt-3 p-3 bg-slate-50 rounded text-sm text-slate-700 leading-relaxed border border-slate-100">
              {abstract}
            </div>
          )}

          {/* BibTeX collapse */}
          {showBibtex && (
            <div className="mt-3 relative">
              <pre className="p-3 bg-slate-900 text-slate-100 rounded text-xs overflow-x-auto font-mono leading-relaxed">
                {bibtex}
              </pre>
              <button
                onClick={copyBibtex}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                title="Copy BibTeX"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AcademicHomeClient() {
  const { language } = useLanguage()

  const bio = {
    zh: '复旦大学硕士在读，研究方向为 Computer-Use Agent 与强化学习。同时担任 WebAgentLab 社区技术负责人，阿里巴巴 Qwen 基模组研究员。致力于构建能够自主操作图形界面的智能体系统，研究成果发表于 CVPR、ICLR 等顶级会议。',
    en: "Master's student at Fudan University, researching Computer-Use Agents and Reinforcement Learning. Serving as Technical Lead at WebAgentLab and Researcher at Qwen, Alibaba. Dedicated to building intelligent agent systems capable of autonomously operating graphical interfaces, with research published at top-tier conferences including CVPR and ICLR.",
  }

  const news = {
    zh: [
      { date: '2026年8月', content: '发布 Qwen-CUA 技术报告与 Qwen 3.8' },
      { date: '2026年7月', content: '发布 EvoCUA-1.5 技术报告' },
      { date: '2026年6月', content: '在阿里巴巴 Qwen 基础大模型组担任算法研究员' },
      { date: '2026年4月', content: '加入美团 LongCat 基础大模型组' },
      { date: '2026年2月', content: '论文《WebChain》被 CVPR 2026 接收（一作）' },
      { date: '2026年1月', content: '论文《WebFactory》被 ICLR 2026 接收（一作）' },
      { date: '2025年12月', content: '搭建个人学术主页' },
      { date: '2025年', content: '担任 WebAgentLab 社区技术负责人' },
      { date: '2024年9月', content: '入读复旦大学硕士' },
      { date: '2024年6月', content: '加入 iMeanAI，从事 GUI Agent 研究' },
      { date: '2024年6月', content: '复旦大学本科毕业' },
      { date: '2020年9月', content: '入读复旦大学本科' },
    ],
    en: [
      { date: 'Aug 2026', content: 'Released the Qwen-CUA technical report and Qwen 3.8' },
      { date: 'Jul 2026', content: 'Released the EvoCUA-1.5 technical report' },
      { date: 'Jun 2026', content: 'Became an Algorithm Researcher in the Qwen foundation model team at Alibaba' },
      { date: 'Apr 2026', content: "Joined Meituan's LongCat foundation model team" },
      { date: 'Feb 2026', content: 'Paper "WebChain" accepted at CVPR 2026 (first author)' },
      { date: 'Jan 2026', content: 'Paper "WebFactory" accepted at ICLR 2026 (first author)' },
      { date: 'Dec 2025', content: 'Launched personal academic website' },
      { date: '2025', content: 'Became Technical Lead at WebAgentLab community' },
      { date: 'Sep 2024', content: "Enrolled in Master's program at Fudan University" },
      { date: 'Jun 2024', content: 'Joined iMeanAI as a GUI Agent Researcher' },
      { date: 'Jun 2024', content: "Graduated from Fudan University with a Bachelor's degree" },
      { date: 'Sep 2020', content: "Enrolled in Bachelor's program at Fudan University" },
    ],
  }

  const interests = {
    zh: ['Computer-Use Agent', 'Web Agent', 'GUI Agent', '强化学习', '大模型训练', '大模型微调'],
    en: ['Computer-Use Agent', 'Web Agent', 'GUI Agent', 'Reinforcement Learning', 'LLM Training', 'LLM Fine-tuning'],
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Hero / Profile */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0">
                <Image
                  src="/avatar.png"
                  alt="Fan Sicheng"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                Fan Sicheng <span className="text-slate-500 font-normal text-xl">（范思诚）</span>
              </h1>
              <p className="text-slate-600 mb-1">
                {language === 'zh' ? '硕士研究生 · 复旦大学' : "Master's Student · Fudan University"}
              </p>
              <p className="text-slate-500 text-sm mb-4">
                {language === 'zh'
                  ? 'WebAgentLab 技术负责人 · 阿里巴巴 Qwen 基础大模型组算法研究员'
                  : 'Technical Lead @ WebAgentLab · Researcher @ Qwen, Alibaba'}
              </p>
              <p className="text-slate-700 leading-relaxed mb-5 max-w-2xl text-sm sm:text-base">
                {bio[language]}
              </p>

              {/* Social links */}
              <div className="flex flex-wrap gap-3">
                <a href="mailto:sicheng_fan@foxmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <Mail className="w-4 h-4" />
                  {language === 'zh' ? '邮件联系' : 'Email'}
                </a>
                <a href="https://github.com/sicheng-fan" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a href="https://x.com/fan_si_cheng" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  <Twitter className="w-4 h-4" />
                  X / Twitter
                </a>
                <a href="https://linkedin.com/in/fansicheng" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">

            {/* Publications */}
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-1 pb-2 border-b border-slate-200">
                {language === 'zh' ? '发表论文' : 'Publications'}
              </h2>
              <div className="space-y-4 mt-5">
                {publications.map((pub) => (
                  <PublicationCard key={pub.id} pub={pub} language={language} />
                ))}
              </div>
            </section>

            {/* Education & Experience */}
            <section className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-5 pb-2 border-b border-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-slate-400" />
                  {language === 'zh' ? '教育经历' : 'Education'}
                </h2>
                <div className="space-y-5">
                  {education[language].map((item) => (
                    <div key={`${item.organization}-${item.period}`} className="border-l-2 border-blue-200 pl-4">
                      <h3 className="font-medium text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.organization}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.period}</p>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-5 pb-2 border-b border-slate-200 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  {language === 'zh' ? '工作经历' : 'Experience'}
                </h2>
                <div className="space-y-5">
                  {experience[language].map((item) => (
                    <div key={`${item.organization}-${item.period}`} className="border-l-2 border-slate-200 pl-4">
                      <h3 className="font-medium text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.organization}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.period}</p>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* News */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {language === 'zh' ? '最新动态' : 'News'}
              </h2>
              <div className="space-y-3">
                {news[language].map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-slate-400 flex-shrink-0 font-mono text-xs mt-0.5 w-20">
                      {item.date}
                    </span>
                    <span className="text-slate-700 leading-snug">{item.content}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Research Interests */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {language === 'zh' ? '研究方向' : 'Research Interests'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests[language].map((interest) => (
                  <span key={interest}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-sm border border-blue-100">
                    {interest}
                  </span>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {language === 'zh' ? '联系方式' : 'Contact'}
              </h2>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href="mailto:sicheng_fan@foxmail.com" className="text-blue-600 hover:underline break-all">
                    sicheng_fan@foxmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href="https://github.com/sicheng-fan" target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    sicheng-fan
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
