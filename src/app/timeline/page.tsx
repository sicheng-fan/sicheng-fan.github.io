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
  const { language, t } = useLanguage()
  const { theme } = useTheme()

  if (theme === 'academic') {
    return <AcademicTimelineClient />
  }

// 时间线数据
const timelineData = [
  {
      title: t.timeline.events.recreationWorldReport.title,
      description: t.timeline.events.recreationWorldReport.description,
    date: language === 'zh' ? '2026年9月' : 'Sep 2026',
    type: 'achievement' as const,
    organization: language === 'zh' ? '阿里巴巴 Qwen' : 'Alibaba Qwen',
    link: 'https://arxiv.org/abs/2609.22000',
    tags: ['RecreationWorld', 'Hybrid Agent', 'Environments'],
  },
  {
      title: t.timeline.events.qwen38Release.title,
      description: t.timeline.events.qwen38Release.description,
    date: language === 'zh' ? '2026年8月' : 'Aug 2026',
    type: 'achievement' as const,
    organization: language === 'zh' ? '阿里巴巴 Qwen' : 'Alibaba Qwen',
    link: 'https://qwen.ai/blog?id=qwen3.8',
    tags: ['Qwen 3.8', 'Foundation Model'],
  },
  {
      title: t.timeline.events.qwenCuaReport.title,
      description: t.timeline.events.qwenCuaReport.description,
    date: language === 'zh' ? '2026年8月' : 'Aug 2026',
    type: 'achievement' as const,
    organization: language === 'zh' ? '阿里巴巴 Qwen' : 'Alibaba Qwen',
    link: 'https://arxiv.org/abs/2608.02352',
    tags: ['Qwen-CUA', 'Computer-Use Agent', 'RL'],
  },
  {
      title: t.timeline.events.evocuaReport.title,
      description: t.timeline.events.evocuaReport.description,
    date: language === 'zh' ? '2026年7月' : 'Jul 2026',
    type: 'achievement' as const,
    organization: language === 'zh' ? '美团 LongCat' : 'Meituan LongCat',
    link: 'https://arxiv.org/abs/2607.09773',
    tags: ['EvoCUA-1.5', 'Online RL', 'Computer-Use Agent'],
  },
  {
      title: t.timeline.events.qwenJoin.title,
      description: t.timeline.events.qwenJoin.description,
    date: language === 'zh' ? '2026年6月' : 'Jun 2026',
    type: 'work' as const,
    organization: language === 'zh' ? '阿里巴巴 Qwen' : 'Alibaba Qwen',
    tags: ['Foundation Model', 'Computer-Use Agent', 'LLM'],
  },
  {
      title: t.timeline.events.meituanJoin.title,
      description: t.timeline.events.meituanJoin.description,
    date: language === 'zh' ? '2026年4月' : 'Apr 2026',
    type: 'work' as const,
    organization: language === 'zh' ? '美团 LongCat' : 'Meituan LongCat',
    tags: ['AI Research', 'Computer-Use Agent', 'LLM'],
  },
  {
      title: t.timeline.events.cvprFirstAuthor.title,
      description: t.timeline.events.cvprFirstAuthor.description,
    date: language === 'zh' ? '2026年2月18日' : 'Feb 18, 2026',
    type: 'achievement' as const,
    link: 'https://arxiv.org/abs/2603.05295',
    tags: ['CVPR', 'First Author', 'GUI Agent'],
  },
  {
      title: t.timeline.events.iclrFirstAuthor.title,
      description: t.timeline.events.iclrFirstAuthor.description,
    date: language === 'zh' ? '2026年1月5日' : 'Jan 5, 2026',
    type: 'achievement' as const,
    link: 'https://arxiv.org/abs/2603.05044',
    tags: ['ICLR', 'First Author', 'GUI Agent'],
  },
  {
      title: t.timeline.events.webAgentLab.title,
      description: t.timeline.events.webAgentLab.description,
    date: language === 'zh' ? '2025年' : '2025',
    type: 'work' as const,
    organization: 'WebAgentLab',
    tags: ['GUI Agent', '开源社区'],
  },
  {
      title: t.timeline.events.webChain.title,
      description: t.timeline.events.webChain.description,
    date: language === 'zh' ? '2024年11月' : 'Nov 2024',
    type: 'project' as const,
    link: 'https://github.com',
    tags: ['数据集', 'GUI Agent', '开源'],
  },
  {
      title: t.timeline.events.imeanai.title,
      description: t.timeline.events.imeanai.description,
    date: language === 'zh' ? '2024年6月' : 'Jun 2024',
    type: 'work' as const,
    organization: 'iMeanAI',
    tags: ['AI Agent', 'LLM', '初创'],
  },
  {
      title: t.timeline.events.masterEnroll.title,
      description: t.timeline.events.masterEnroll.description,
    date: language === 'zh' ? '2024年9月' : 'Sep 2024',
    type: 'education' as const,
    organization: language === 'zh' ? '复旦大学' : 'Fudan University',
    location: language === 'zh' ? '上海' : 'Shanghai',
    tags: language === 'zh'
      ? ['硕士', 'Computer-Use Agent', 'Hybrid Agent', '强化学习']
      : ["Master's", 'Computer-Use Agent', 'Hybrid Agent', 'Reinforcement Learning'],
  },
  {
      title: t.timeline.events.bachelorGrad.title,
      description: t.timeline.events.bachelorGrad.description,
    date: language === 'zh' ? '2024年6月' : 'Jun 2024',
    type: 'education' as const,
    organization: language === 'zh' ? '复旦大学' : 'Fudan University',
    location: language === 'zh' ? '上海' : 'Shanghai',
    tags: ['本科毕业', '学士学位'],
  },
  {
      title: t.timeline.events.marl.title,
      description: t.timeline.events.marl.description,
    date: language === 'zh' ? '2023年9月' : 'Sep 2023',
    type: 'milestone' as const,
    tags: ['强化学习', 'Multi-Agent', '科研'],
  },
  {
      title: t.timeline.events.pytorch.title,
      description: t.timeline.events.pytorch.description,
    date: language === 'zh' ? '2022年' : '2022',
    type: 'milestone' as const,
    tags: ['PyTorch', 'TensorFlow', '深度学习'],
  },
  {
      title: t.timeline.events.firstCode.title,
      description: t.timeline.events.firstCode.description,
    date: language === 'zh' ? '2020年' : '2020',
    type: 'milestone' as const,
    tags: ['Python', 'Hello World', '编程入门'],
  },
  {
      title: t.timeline.events.bachelorEnroll.title,
      description: t.timeline.events.bachelorEnroll.description,
    date: language === 'zh' ? '2020年9月' : 'Sep 2020',
    type: 'education' as const,
    organization: language === 'zh' ? '复旦大学' : 'Fudan University',
    location: language === 'zh' ? '上海' : 'Shanghai',
    tags: ['本科', '新起点'],
  },
  {
      title: t.timeline.events.born.title,
      description: t.timeline.events.born.description,
    date: language === 'zh' ? '2003年' : '2003',
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
