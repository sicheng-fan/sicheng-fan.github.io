'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Github, Star, GitFork, ExternalLink } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeader } from '@/components/SectionHeader'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { AcademicProjectsClient } from '@/components/academic/AcademicProjectsClient'

// 项目数据
const allProjectsData = [
  {
    title: 'WebChain',
    description: {
      zh: 'WebChain 是迄今为止最大的开源人工标注真实网页交互轨迹数据集，包含 31,725 条轨迹和 318,000 个步骤，为 GUI Agent 研究提供高质量的数据基础。CVPR 2026 一作。',
      en: 'WebChain is the largest open-source dataset of human-annotated trajectories on real-world websites, comprising 31,725 trajectories with 318,000 steps. First-author paper at CVPR 2026.',
    },
    tags: ['Python', 'Dataset', 'GUI Agent', 'CVPR 2026'],
    github: 'https://github.com/franskey-0112/WebChain',
    paper: 'https://arxiv.org/abs/2603.05295',
    stars: 6,
    forks: 0,
    status: 'active' as const,
    category: 'Research',
  },
  {
    title: 'WebFactory',
    description: {
      zh: 'WebFactory 是自动化强化学习训练流程，在无需不安全实时网络交互或昂贵人工标注的情况下训练 GUI 网页智能体。ICLR 2026 一作。',
      en: 'WebFactory is an automated RL training pipeline for GUI web agents, eliminating unsafe live web interactions and expensive human-annotated datasets. First-author paper at ICLR 2026.',
    },
    tags: ['Python', 'RL', 'GUI Agent', 'ICLR 2026'],
    github: 'https://github.com/franskey-0112/WebFactory',
    paper: 'https://arxiv.org/abs/2603.05044',
    stars: 2,
    forks: 0,
    status: 'active' as const,
    category: 'Research',
  },
  {
    title: 'WebClone',
    description: {
      zh: 'Web Agent 评测环境。提供离线可控的网站克隆用于 AI Agent 可复现测试，支持批量数据生成与标准化评估流程。',
      en: 'Web Agent evaluation environment. Provides offline controllable website cloning for reproducible AI Agent testing, supporting batch data generation and standardized evaluation.',
    },
    tags: ['JavaScript', 'Web Agent', 'Evaluation'],
    github: 'https://github.com/franskey-0112/WebClone',
    stars: 7,
    forks: 5,
    status: 'active' as const,
    category: 'Tools',
  },
  {
    title: 'CafeMeet',
    description: {
      zh: '智能会面地点推荐系统。基于 AI 和地图数据分析，为多人会面智能推荐最佳咖啡馆，综合考量评分、距离、环境、交通等多维因素，让社交活动规划变得轻松愉快。',
      en: 'Smart meeting spot recommendation system. Using AI and map data analysis to intelligently recommend the best cafés for group meetings, considering ratings, distance, ambiance, and transportation.',
    },
    tags: ['Python', 'FastAPI', 'AI', 'Map', 'OpenManus'],
    github: 'https://github.com/franskey-0112/CafeMeet',
    stars: 22,
    forks: 5,
    status: 'active' as const,
    category: 'AI & ML',
  },
]

const categories = ['All', ...Array.from(new Set(allProjectsData.map((p) => p.category)))]
const statuses = ['all', 'active', 'wip', 'archived']

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const { language, t } = useLanguage()
  const { theme } = useTheme()

  if (theme === 'academic') {
    const academicProjects = allProjectsData.map((p) => ({
      ...p,
      description: p.description,
    }))
    return <AcademicProjectsClient projects={academicProjects} />
  }

  const allProjects = allProjectsData.map(p => ({
    ...p,
    description: p.description[language],
  }))

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // 计算统计数据
  const totalStars = allProjects.reduce((acc, p) => acc + (p.stars || 0), 0)
  const totalForks = allProjects.reduce((acc, p) => acc + (p.forks || 0), 0)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <SectionHeader
          title={t.projects.title}
          subtitle={t.projects.subtitle}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="cyber-card text-center py-4">
            <div className="text-2xl font-display font-bold text-cyber-green">{allProjects.length}</div>
            <div className="text-xs font-mono text-cyber-gray uppercase">{t.projects.stats.projects}</div>
          </div>
          <div className="cyber-card text-center py-4">
            <div className="text-2xl font-display font-bold text-cyber-yellow flex items-center justify-center gap-1">
              <Star className="w-5 h-5" />
              {totalStars.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-cyber-gray uppercase">{t.projects.stats.stars}</div>
          </div>
          <div className="cyber-card text-center py-4">
            <div className="text-2xl font-display font-bold text-cyber-cyan flex items-center justify-center gap-1">
              <GitFork className="w-5 h-5" />
              {totalForks.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-cyber-gray uppercase">{t.projects.stats.forks}</div>
          </div>
          <div className="cyber-card text-center py-4">
            <div className="text-2xl font-display font-bold text-cyber-orange">
              {allProjects.filter((p) => p.status === 'active').length}
            </div>
            <div className="text-xs font-mono text-cyber-gray uppercase">{t.projects.stats.active}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-gray" />
            <input
              type="text"
              placeholder={t.projects.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cyber-input"
              style={{ paddingLeft: '48px' }}
            />
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cyber-tag cursor-pointer transition-all ${
                    selectedCategory === category
                      ? 'bg-cyber-green/20 border-cyber-green text-cyber-green'
                      : 'hover:border-cyber-green/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-cyber-gray font-mono text-xs">{t.projects.status}</span>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 text-xs font-mono uppercase rounded transition-all ${
                    selectedStatus === status
                      ? status === 'active'
                        ? 'bg-cyber-green/20 text-cyber-green'
                        : status === 'wip'
                        ? 'bg-cyber-orange/20 text-cyber-orange'
                        : status === 'archived'
                        ? 'bg-cyber-gray/20 text-cyber-gray'
                        : 'bg-cyber-cyan/20 text-cyber-cyan'
                      : 'text-cyber-gray hover:text-cyber-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="font-mono text-sm text-cyber-gray mb-8">
          {t.projects.showing} <span className="text-cyber-green">{filteredProjects.length}</span> {t.projects.of} {allProjects.length} {language === 'zh' ? '个项目' : 'projects'}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyber-dark border border-cyber-green/30 mb-6">
              <Search className="w-8 h-8 text-cyber-gray" />
            </div>
            <h3 className="font-display text-xl text-cyber-white mb-2">{t.projects.noProjects}</h3>
            <p className="text-cyber-gray font-mono">{t.projects.tryAdjust}</p>
          </div>
        )}

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="cyber-card text-center py-12">
            <Github className="w-12 h-12 mx-auto mb-4 text-cyber-white" />
            <h3 className="font-display text-2xl font-bold text-cyber-white mb-2">
              {t.projects.github.title}
            </h3>
            <p className="text-cyber-gray mb-6 max-w-md mx-auto">
              {t.projects.github.description}
            </p>
            <a
              href="https://github.com/franskey-0112"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button inline-flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              {t.projects.github.viewProfile}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
