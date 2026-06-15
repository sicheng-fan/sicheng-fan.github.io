'use client'

import { useTheme } from '@/lib/theme'
import { AcademicHomeClient } from '@/components/academic/AcademicHomeClient'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, Rss, Folder, Clock, User, 
  FileCode, Coffee, GitBranch, Zap
} from 'lucide-react'
import { Terminal } from '@/components/Terminal'
import { TypeWriter } from '@/components/TypeWriter'
import { GlitchText } from '@/components/GlitchText'
import { BlogCard } from '@/components/BlogCard'
import { ProjectCard } from '@/components/ProjectCard'
import { StatsCard } from '@/components/StatsCard'
import { SectionHeader } from '@/components/SectionHeader'
import { useLanguage } from '@/lib/i18n'
import type { PostMeta } from '@/lib/mdx'

// 精选项目
const featuredProjects = [
  {
    title: 'WebChain',
    description: {
      zh: '迄今最大开源人工标注网页交互轨迹数据集，31,725 条轨迹，为 GUI Agent 研究奠定数据基础。CVPR 2026。',
      en: 'The largest open-source human-annotated web interaction trajectory dataset (31,725 trajectories). Powering GUI agent research. CVPR 2026.',
    },
    tags: ['Python', 'Dataset', 'GUI Agent', 'CVPR 2026'],
    github: 'https://github.com/franskey-0112/WebChain',
    stars: 6,
    forks: 0,
    status: 'active' as const,
  },
  {
    title: 'WebFactory',
    description: {
      zh: '自动化 GUI Agent 强化学习训练框架，无需昂贵人工标注数据集。ICLR 2026。',
      en: 'Automated RL training pipeline for GUI web agents, no expensive human annotations needed. ICLR 2026.',
    },
    tags: ['Python', 'RL', 'GUI Agent', 'ICLR 2026'],
    github: 'https://github.com/franskey-0112/WebFactory',
    stars: 2,
    forks: 0,
    status: 'active' as const,
  },
  {
    title: 'CafeMeet',
    description: {
      zh: '智能会面地点推荐系统。基于 AI 和地图数据分析，为多人会面智能推荐最佳咖啡馆。',
      en: 'Smart meeting spot recommendation system. Using AI and map data analysis to recommend the best cafés for group meetings.',
    },
    tags: ['Python', 'FastAPI', 'AI', 'Map'],
    github: 'https://github.com/franskey-0112/CafeMeet',
    stars: 22,
    forks: 5,
    status: 'active' as const,
  },
]

// 研究领域数据
const researchFields = {
  zh: [
    { name: '强化学习', icon: '🎯', desc: 'Reinforcement Learning' },
    { name: 'GUI Agent', icon: '🖥️', desc: 'Graphical User Interface Agent' },
    { name: '大模型训练', icon: '🧠', desc: 'LLM Training' },
    { name: '大模型微调', icon: '🔧', desc: 'LLM Fine-tuning' },
  ],
  en: [
    { name: 'Reinforcement Learning', icon: '🎯', desc: 'RL' },
    { name: 'GUI Agent', icon: '🖥️', desc: 'Graphical User Interface Agent' },
    { name: 'LLM Training', icon: '🧠', desc: 'Large Language Model' },
    { name: 'LLM Fine-tuning', icon: '🔧', desc: 'Instruction Tuning & Alignment' },
  ],
}

interface HomePageClientProps {
  zhPosts: PostMeta[]
  enPosts: PostMeta[]
}

export function HomePageClient({ zhPosts, enPosts }: HomePageClientProps) {
  const { theme } = useTheme()
  const { language, t } = useLanguage()

  if (theme === 'academic') {
    return <AcademicHomeClient zhPosts={zhPosts} enPosts={enPosts} />
  }

  // 根据当前语言选择博客列表
  const recentPosts = language === 'zh' ? zhPosts : enPosts

  // 终端演示内容
  const terminalLines = [
    { type: 'command' as const, content: 'whoami', delay: 80 },
    { type: 'output' as const, content: 'Fan Sicheng - Developer / Creator / Tech Enthusiast' },
    { type: 'command' as const, content: 'cat /var/interests.txt', delay: 60 },
    { type: 'output' as const, content: '• Full-stack Development\n• System Architecture\n• Open Source\n• AI & Machine Learning' },
    { type: 'command' as const, content: 'echo $CURRENT_STATUS', delay: 70 },
    { type: 'success' as const, content: 'Ready to build amazing things!' },
  ]

  // 快速链接
  const quickLinks = [
    { href: '/blog', icon: Rss, label: t.home.quickLinks.blog.label, desc: t.home.quickLinks.blog.desc },
    { href: '/projects', icon: Folder, label: t.home.quickLinks.projects.label, desc: t.home.quickLinks.projects.desc },
    { href: '/timeline', icon: Clock, label: t.home.quickLinks.timeline.label, desc: t.home.quickLinks.timeline.desc },
    { href: '/about', icon: User, label: t.home.quickLinks.about.label, desc: t.home.quickLinks.about.desc },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-dark border border-cyber-green/30 rounded mb-8"
              >
                <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                <span className="font-mono text-sm text-cyber-green">{t.home.systemOnline}</span>
              </motion.div>

              {/* Main Title */}
              <h1 className="font-display text-5xl md:text-7xl font-black mb-6">
                <span className="text-cyber-white">{t.home.greeting}</span>
                <br />
                <GlitchText 
                  text="FAN SICHENG" 
                  className="text-cyber-green neon-glow-subtle"
                />
              </h1>

              {/* Subtitle with TypeWriter */}
              <div className="text-xl md:text-2xl text-cyber-gray mb-8 h-16">
                <span className="text-cyber-cyan">{'>'}</span>{' '}
                <TypeWriter
                  texts={t.home.roles}
                  speed={80}
                  className="text-cyber-white"
                />
              </div>

              {/* Description */}
              <p className="text-cyber-gray text-lg leading-relaxed mb-8 max-w-lg">
                {t.home.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/blog" className="cyber-button">
                  <span className="relative z-10 flex items-center gap-2">
                    {t.home.exploreBlog}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link
                  href="/projects"
                  className="px-6 py-3 border border-cyber-cyan/50 text-cyber-cyan font-mono hover:bg-cyber-cyan/10 transition-all"
                >
                  {t.home.viewProjects}
                </Link>
              </div>
            </motion.div>

            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <Terminal
                lines={terminalLines}
                title="guest@fansicheng.online"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-cyber-gray">
            <span className="font-mono text-xs">{t.home.scrollDown}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 border-2 border-cyber-green/50 rounded-full flex justify-center pt-2"
            >
              <div className="w-1 h-2 bg-cyber-green rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={link.href} className="block group">
                    <div className="cyber-card text-center py-8 h-full">
                      <Icon className="w-10 h-10 mx-auto mb-4 text-cyber-green group-hover:text-cyber-cyan transition-colors" />
                      <h3 className="font-display text-lg font-bold text-cyber-white mb-2">
                        {link.label}
                      </h3>
                      <p className="text-cyber-gray text-sm">{link.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 border-y border-cyber-green/10">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={t.home.stats.title}
            subtitle={t.home.stats.subtitle}
            align="center"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatsCard icon={FileCode} value={recentPosts.length} suffix="+" label={t.home.stats.blogPosts} color="green" />
            <StatsCard icon={GitBranch} value={10} suffix="+" label={t.home.stats.projects} color="cyan" />
            <StatsCard icon={Coffee} value={500} suffix="+" label={t.home.stats.coffee} color="orange" />
            <StatsCard icon={Zap} value={5} suffix="+" label={t.home.stats.yearsCoding} color="yellow" />
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <SectionHeader
              title={t.home.recentPosts.title}
              subtitle={t.home.recentPosts.subtitle}
            />
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-cyber-cyan hover:text-cyber-green transition-colors font-mono"
            >
              {t.home.recentPosts.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {recentPosts.slice(0, 4).map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/blog" className="cyber-button inline-flex items-center gap-2">
              {t.home.recentPosts.viewAllPosts}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-4 border-t border-cyber-green/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <SectionHeader
              title={t.home.featuredProjects.title}
              subtitle={t.home.featuredProjects.subtitle}
            />
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-2 text-cyber-cyan hover:text-cyber-green transition-colors font-mono"
            >
              {t.home.featuredProjects.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard 
                key={project.title} 
                {...project} 
                description={project.description[language]}
              />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/projects" className="cyber-button inline-flex items-center gap-2">
              {t.home.featuredProjects.viewAllProjects}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tech & Research Section */}
      <section className="py-20 px-4 border-t border-cyber-green/10">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={t.home.tech.title}
            subtitle={t.home.tech.subtitle}
            align="center"
          />
          
          {/* 技术栈 */}
          <div className="mb-12">
            <h3 className="font-mono text-cyber-cyan text-sm mb-6 text-center">{t.home.tech.languages}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Python', icon: '🐍' },
                { name: 'C/C++', icon: '⚙️' },
                { name: 'TypeScript', icon: '📘' },
                { name: 'PyTorch', icon: '🔥' },
                { name: 'React', icon: '⚛️' },
                { name: 'Next.js', icon: '▲' },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="cyber-card text-center py-6 group cursor-default"
                >
                  <span className="text-2xl mb-2 block group-hover:scale-125 transition-transform">
                    {tech.icon}
                  </span>
                  <span className="font-mono text-sm text-cyber-gray group-hover:text-cyber-white transition-colors">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 研究领域 */}
          <div>
            <h3 className="font-mono text-cyber-cyan text-sm mb-6 text-center">{t.home.tech.research}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {researchFields[language].map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="cyber-card text-center py-6 group cursor-default"
                >
                  <span className="text-2xl mb-2 block group-hover:scale-125 transition-transform">
                    {field.icon}
                  </span>
                  <span className="font-mono text-sm text-cyber-white block mb-1">
                    {field.name}
                  </span>
                  <span className="font-mono text-xs text-cyber-gray">
                    {field.desc}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="terminal-window"
          >
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-4 font-mono text-sm text-cyber-gray">contact.sh</span>
            </div>
            <div className="p-8 text-center">
              <h2 className="font-display text-3xl font-bold text-cyber-green mb-4">
                {t.home.contact.title}
              </h2>
              <p className="text-cyber-gray text-lg mb-8 max-w-xl mx-auto">
                {t.home.contact.subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:sicheng_fan@foxmail.com"
                  className="cyber-button"
                >
                  {t.home.contact.sendEmail}
                </a>
                <a
                  href="https://github.com/franskey-0112"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-cyber-cyan/50 text-cyber-cyan font-mono hover:bg-cyber-cyan/10 transition-all"
                >
                  {t.home.contact.githubProfile}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
