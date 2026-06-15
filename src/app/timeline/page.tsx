'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Calendar, Briefcase, GraduationCap, Code, Award, Star } from 'lucide-react'
import { TimelineItem } from '@/components/TimelineItem'
import { SectionHeader } from '@/components/SectionHeader'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { AcademicTimelineClient } from '@/components/academic/AcademicTimelineClient'

export default function TimelinePage() {
  const [selectedType, setSelectedType] = useState('all')
  const { t } = useLanguage()
  const { theme } = useTheme()

  if (theme === 'academic') {
    return <AcademicTimelineClient />
  }

// 时间线数据
const timelineData = [
  {
      title: t.timeline.events.meituanJoin.title,
      description: t.timeline.events.meituanJoin.description,
    date: '2026年4月',
    type: 'work' as const,
    organization: '美团 LongCat',
    tags: ['AI Research', 'Computer-Use Agent', 'LLM'],
  },
  {
      title: t.timeline.events.cvprFirstAuthor.title,
      description: t.timeline.events.cvprFirstAuthor.description,
    date: '2026年2月18日',
    type: 'achievement' as const,
    link: 'https://arxiv.org/abs/2603.05295',
    tags: ['CVPR', 'First Author', 'GUI Agent'],
  },
  {
      title: t.timeline.events.iclrFirstAuthor.title,
      description: t.timeline.events.iclrFirstAuthor.description,
    date: '2026年1月5日',
    type: 'achievement' as const,
    link: 'https://arxiv.org/abs/2603.05044',
    tags: ['ICLR', 'First Author', 'GUI Agent'],
  },
  {
      title: t.timeline.events.digitalSpace.title,
      description: t.timeline.events.digitalSpace.description,
    date: '2025年12月',
    type: 'milestone' as const,
    tags: ['Next.js', 'React', '个人网站'],
  },
  {
      title: t.timeline.events.webAgentLab.title,
      description: t.timeline.events.webAgentLab.description,
    date: '2025年',
    type: 'work' as const,
    organization: 'WebAgentLab',
    tags: ['GUI Agent', '开源社区'],
  },
  {
      title: t.timeline.events.webChain.title,
      description: t.timeline.events.webChain.description,
    date: '2024年11月',
    type: 'project' as const,
    link: 'https://github.com',
    tags: ['数据集', 'GUI Agent', '开源'],
  },
  {
      title: t.timeline.events.imeanai.title,
      description: t.timeline.events.imeanai.description,
    date: '2024年6月',
    type: 'work' as const,
    organization: 'iMeanAI',
    tags: ['AI Agent', 'LLM', '初创'],
  },
  {
      title: t.timeline.events.masterEnroll.title,
      description: t.timeline.events.masterEnroll.description,
    date: '2024年9月',
    type: 'education' as const,
    organization: '复旦大学',
    location: '上海',
    tags: ['硕士', 'GUI Agent', '强化学习'],
  },
  {
      title: t.timeline.events.bachelorGrad.title,
      description: t.timeline.events.bachelorGrad.description,
    date: '2024年6月',
    type: 'education' as const,
    organization: '复旦大学',
    location: '上海',
    tags: ['本科毕业', '学士学位'],
  },
  {
      title: t.timeline.events.marl.title,
      description: t.timeline.events.marl.description,
    date: '2023年 9月',
    type: 'milestone' as const,
    tags: ['强化学习', 'Multi-Agent', '科研'],
  },
  {
      title: t.timeline.events.pytorch.title,
      description: t.timeline.events.pytorch.description,
    date: '2022年',
    type: 'milestone' as const,
    tags: ['PyTorch', 'TensorFlow', '深度学习'],
  },
  {
      title: t.timeline.events.firstCode.title,
      description: t.timeline.events.firstCode.description,
    date: '2020年',
    type: 'milestone' as const,
    tags: ['Python', 'Hello World', '编程入门'],
  },
  {
      title: t.timeline.events.bachelorEnroll.title,
      description: t.timeline.events.bachelorEnroll.description,
    date: '2020年9月',
    type: 'education' as const,
    organization: '复旦大学',
    location: '上海',
    tags: ['本科', '新起点'],
  },
  {
      title: t.timeline.events.born.title,
      description: t.timeline.events.born.description,
    date: '2003年',
    type: 'achievement' as const,
    tags: ['起源', '人生开始'],
  },
]

const typeFilters = [
    { value: 'all', label: t.timeline.filters.all, icon: Filter },
    { value: 'work', label: t.timeline.filters.work, icon: Briefcase },
    { value: 'education', label: t.timeline.filters.education, icon: GraduationCap },
    { value: 'project', label: t.timeline.filters.project, icon: Code },
    { value: 'achievement', label: t.timeline.filters.achievement, icon: Award },
    { value: 'milestone', label: t.timeline.filters.milestone, icon: Star },
]

  const filteredTimeline = timelineData.filter(
    (item) => selectedType === 'all' || item.type === selectedType
  )

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <SectionHeader
          title={t.timeline.title}
          subtitle={t.timeline.subtitle}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {typeFilters.slice(1).map((type) => {
            const count = timelineData.filter((item) => item.type === type.value).length
            const Icon = type.icon
            return (
              <div key={type.value} className="cyber-card text-center py-4">
                <Icon className="w-5 h-5 mx-auto mb-2 text-cyber-cyan" />
                <div className="text-xl font-display font-bold text-cyber-white">{count}</div>
                <div className="text-xs font-mono text-cyber-gray uppercase">{type.label}</div>
              </div>
            )
          })}
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {typeFilters.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.value
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all rounded ${
                  isSelected
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan'
                    : 'text-cyber-gray border border-cyber-gray/20 hover:border-cyber-cyan/50 hover:text-cyber-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            )
          })}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-cyber-cyan/20" />

          {/* Timeline items */}
          {filteredTimeline.map((item, index) => (
            <TimelineItem
              key={`${item.title}-${item.date}`}
              {...item}
              isLast={index === filteredTimeline.length - 1}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredTimeline.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyber-dark border border-cyber-cyan/20 mb-6">
              <Calendar className="w-8 h-8 text-cyber-gray" />
            </div>
            <h3 className="font-display text-xl text-cyber-white mb-2">{t.timeline.noItems}</h3>
            <p className="text-cyber-gray font-mono">{t.timeline.tryFilter}</p>
          </div>
        )}

        {/* Add your own note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="ml-4 font-mono text-sm text-cyber-gray">future.md</span>
            </div>
            <div className="p-8 text-center">
              <h3 className="font-display text-2xl font-bold text-cyber-cyan mb-4">
                {t.timeline.future.title}
              </h3>
              <p className="text-cyber-gray max-w-md mx-auto font-mono">
                {t.timeline.future.description}
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
