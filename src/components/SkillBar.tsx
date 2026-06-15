'use client'

import { motion } from 'framer-motion'
import { 
  Code2, Brain, Cpu, Wrench, 
  Sparkles, Zap, Terminal, Database,
  GitBranch, Box, MonitorSmartphone, Settings
} from 'lucide-react'

// 技能等级对应的样式
const getLevelStyle = (level: number) => {
  if (level >= 90) return { 
    bg: 'bg-cyber-green/20', 
    border: 'border-cyber-green', 
    text: 'text-cyber-green',
    glow: 'shadow-[0_0_10px_rgba(0,255,136,0.3)]'
  }
  if (level >= 80) return { 
    bg: 'bg-cyber-cyan/20', 
    border: 'border-cyber-cyan', 
    text: 'text-cyber-cyan',
    glow: ''
  }
  if (level >= 70) return { 
    bg: 'bg-cyber-yellow/20', 
    border: 'border-cyber-yellow', 
    text: 'text-cyber-yellow',
    glow: ''
  }
  return { 
    bg: 'bg-cyber-gray/20', 
    border: 'border-cyber-gray', 
    text: 'text-cyber-gray',
    glow: ''
  }
}

// 分类对应的图标
const categoryIcons: Record<string, typeof Code2> = {
  '编程语言': Code2,
  '研究领域': Brain,
  'AI 框架': Cpu,
  '开发工具': Wrench,
}

interface SkillTagProps {
  name: string
  level: number
  index: number
}

export function SkillTag({ name, level, index }: SkillTagProps) {
  const style = getLevelStyle(level)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg
        border ${style.border} ${style.bg} ${style.glow}
        transition-all duration-300 cursor-default
        hover:${style.bg.replace('/20', '/30')}
      `}
    >
      <span className={`font-mono text-sm ${style.text}`}>{name}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded ${style.bg} ${style.text} font-mono`}>
        {level >= 90 ? '精通' : level >= 80 ? '熟练' : level >= 70 ? '掌握' : '了解'}
      </span>
    </motion.div>
  )
}

interface SkillCategoryProps {
  title: string
  skills: Array<{ name: string; level: number }>
}

export function SkillCategory({ title, skills }: SkillCategoryProps) {
  const Icon = categoryIcons[title] || Sparkles
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="cyber-card group"
    >
      {/* 标题栏 - 终端风格 */}
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-cyber-green/20">
        <div className="p-2 rounded-lg bg-cyber-green/10 border border-cyber-green/30 group-hover:border-cyber-green/50 transition-colors">
          <Icon className="w-5 h-5 text-cyber-green" />
        </div>
        <div>
          <h3 className="font-mono text-sm text-cyber-green">
            <span className="text-cyber-gray">$</span> ls {title.toLowerCase().replace(/ /g, '_')}/
          </h3>
          <p className="text-[10px] text-cyber-gray font-mono mt-0.5">
            {skills.length} items
          </p>
        </div>
      </div>
      
      {/* 技能标签云 */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <SkillTag 
            key={skill.name} 
            name={skill.name} 
            level={skill.level}
            index={index}
          />
        ))}
      </div>
      
      {/* 底部装饰 */}
      <div className="mt-4 pt-3 border-t border-cyber-dark flex items-center gap-2 text-[10px] text-cyber-gray font-mono">
        <Zap className="w-3 h-3 text-cyber-yellow" />
        <span>
          {skills.filter(s => s.level >= 90).length} 精通 · {skills.filter(s => s.level >= 80 && s.level < 90).length} 熟练
        </span>
      </div>
    </motion.div>
  )
}

// 新增：研究领域专用展示组件
interface ResearchAreaProps {
  areas: Array<{
    title: string
    description: string
    tags: string[]
    status: 'active' | 'exploring' | 'completed'
  }>
}

export function ResearchAreas({ areas }: ResearchAreaProps) {
  const statusConfig = {
    active: { label: '进行中', color: 'text-cyber-green', bg: 'bg-cyber-green/20', border: 'border-cyber-green' },
    exploring: { label: '探索中', color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/20', border: 'border-cyber-cyan' },
    completed: { label: '已完成', color: 'text-cyber-gray', bg: 'bg-cyber-gray/20', border: 'border-cyber-gray' },
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {areas.map((area, index) => {
        const status = statusConfig[area.status]
        return (
          <motion.div
            key={area.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`cyber-card border-l-2 ${status.border} h-full`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-mono text-cyber-white">{area.title}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded ${status.bg} ${status.color} font-mono whitespace-nowrap`}>
                {status.label}
              </span>
            </div>
            <p className="text-sm text-cyber-gray mb-3">{area.description}</p>
            <div className="flex flex-wrap gap-1">
              {area.tags.map((tag) => (
                <span 
                  key={tag}
                  className="text-[10px] px-2 py-0.5 bg-cyber-dark rounded text-cyber-gray font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

