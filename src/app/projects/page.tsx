'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Github, Star, GitFork, ExternalLink } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeader } from '@/components/SectionHeader'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { useGithubStats } from '@/lib/useGithubStats'
import { projects as allProjectsData, GITHUB_USERNAME } from '@/data/projects'
import { AcademicProjectsClient } from '@/components/academic/AcademicProjectsClient'

const categories = ['All', ...Array.from(new Set(allProjectsData.map((p) => p.category)))]
const statuses = ['all', 'active', 'wip', 'archived']

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const { language, t } = useLanguage()
  const { theme } = useTheme()
  const { getStats } = useGithubStats()

  const projectsWithLiveStats = allProjectsData.map((project) => {
    const live = getStats(project.github)
    return { ...project, stars: live.stars, forks: live.forks }
  })

  if (theme === 'academic') {
    const academicProjects = projectsWithLiveStats.map((p) => ({
      ...p,
      description: p.description,
    }))
    return <AcademicProjectsClient projects={academicProjects} />
  }

  const allProjects = projectsWithLiveStats.map(p => {
    return {
      ...p,
      description: p.description[language],
    }
  })

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalStars = allProjects.reduce((acc, p) => acc + (p.stars || 0), 0)
  const totalForks = allProjects.reduce((acc, p) => acc + (p.forks || 0), 0)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={t.projects.title} subtitle={t.projects.subtitle} />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="cyber-card text-center py-4">
            <div className="text-2xl font-display font-bold text-cyber-cyan">{allProjects.length}</div>
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
            <div className="text-2xl font-display font-bold text-cyber-pink flex items-center justify-center gap-1">
              <GitFork className="w-5 h-5" />
              {totalForks.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-cyber-gray uppercase">{t.projects.stats.forks}</div>
          </div>
          <div className="cyber-card text-center py-4">
            <div className="text-2xl font-display font-bold text-cyber-green">
              {allProjects.filter((p) => p.status === 'active').length}
            </div>
            <div className="text-xs font-mono text-cyber-gray uppercase">{t.projects.stats.active}</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
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

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cyber-tag cursor-pointer transition-all ${
                    selectedCategory === category
                      ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                      : 'hover:border-cyber-cyan/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-cyber-gray font-mono text-xs">{t.projects.status}</span>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 text-xs font-mono uppercase rounded-lg transition-all ${
                    selectedStatus === status
                      ? status === 'active'
                        ? 'bg-cyber-green/15 text-cyber-green'
                        : status === 'wip'
                        ? 'bg-cyber-orange/15 text-cyber-orange'
                        : status === 'archived'
                        ? 'bg-cyber-gray/15 text-cyber-gray'
                        : 'bg-cyber-cyan/15 text-cyber-cyan'
                      : 'text-cyber-gray hover:text-cyber-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="font-mono text-sm text-cyber-gray mb-8">
          {t.projects.showing} <span className="text-cyber-cyan">{filteredProjects.length}</span> {t.projects.of} {allProjects.length} {language === 'zh' ? '个项目' : 'projects'}
        </div>

        {/* Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-10 h-10 text-cyber-gray mx-auto mb-4" />
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
              href={`https://github.com/${GITHUB_USERNAME}`}
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
