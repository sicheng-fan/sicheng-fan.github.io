'use client'

import { motion } from 'framer-motion'
import { GlitchText } from './GlitchText'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  glitch?: boolean
}

export function SectionHeader({
  title,
  subtitle,
  align = 'left',
  glitch = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}
    >
      {/* 装饰线 */}
      {align === 'left' && (
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-0.5 bg-cyber-green" />
          <span className="font-mono text-xs text-cyber-green uppercase tracking-widest">
            Section
          </span>
        </div>
      )}
      
      {/* 标题 */}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-cyber-white mb-4">
        {glitch ? <GlitchText text={title} /> : title}
      </h2>
      
      {/* 副标题 */}
      {subtitle && (
        <p className={`text-cyber-gray text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
      
      {/* 底部装饰 */}
      {align === 'center' && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyber-green rounded-full" />
            <div className="w-16 h-0.5 bg-cyber-green/50" />
            <div className="w-2 h-2 bg-cyber-cyan rounded-full" />
            <div className="w-16 h-0.5 bg-cyber-cyan/50" />
            <div className="w-2 h-2 bg-cyber-orange rounded-full" />
          </div>
        </div>
      )}
    </motion.div>
  )
}

