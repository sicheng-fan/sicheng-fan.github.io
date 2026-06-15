'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Building, Award, Code, GraduationCap, Briefcase, Star } from 'lucide-react'

type TimelineType = 'work' | 'education' | 'project' | 'achievement' | 'milestone'

interface TimelineItemProps {
  title: string
  description: string
  date: string
  type: TimelineType
  location?: string
  organization?: string
  tags?: string[]
  link?: string
  isLast?: boolean
}

const typeConfig = {
  work: {
    icon: Briefcase,
    color: 'cyber-cyan',
    label: 'WORK',
  },
  education: {
    icon: GraduationCap,
    color: 'cyber-cyan',
    label: 'EDUCATION',
  },
  project: {
    icon: Code,
    color: 'cyber-orange',
    label: 'PROJECT',
  },
  achievement: {
    icon: Award,
    color: 'cyber-yellow',
    label: 'ACHIEVEMENT',
  },
  milestone: {
    icon: Star,
    color: 'cyber-pink',
    label: 'MILESTONE',
  },
}

export function TimelineItem({
  title,
  description,
  date,
  type,
  location,
  organization,
  tags,
  link,
  isLast = false,
}: TimelineItemProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="relative pl-8 pb-8 group"
    >
      {/* 连接线 */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan/40 to-transparent" />
      )}

      {/* 时间点图标 */}
      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-cyber-dark border-2 border-${config.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={`w-3 h-3 text-${config.color}`} />
      </div>

      {/* 卡片内容 */}
      <div className="cyber-card">
        {/* 类型标签 */}
        <div className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-${config.color}/10 text-${config.color} border border-${config.color}/30 mb-3`}>
          {config.label}
        </div>

        {/* 日期 */}
        <div className="flex items-center gap-2 text-cyber-gray text-sm font-mono mb-2">
          <Calendar className="w-4 h-4" />
          {date}
        </div>

        {/* 标题 */}
        <h3 className="font-display text-xl font-bold text-cyber-white mb-2 group-hover:text-cyber-cyan transition-colors">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        {/* 组织/地点信息 */}
        <div className="flex flex-wrap gap-4 text-sm text-cyber-gray mb-3">
          {organization && (
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4" />
              {organization}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
          )}
        </div>

        {/* 描述 */}
        <p className="text-cyber-gray leading-relaxed mb-4">
          {description}
        </p>

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="cyber-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

