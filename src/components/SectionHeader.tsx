'use client'

import { motion } from 'framer-motion'

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
  glitch = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}
    >
      {align === 'left' && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-pink" />
          <span className="font-mono text-xs text-cyber-cyan uppercase tracking-widest">
            Section
          </span>
        </div>
      )}

      <h2 className="font-display text-3xl md:text-4xl font-bold text-cyber-white mb-4">
        {title}
      </h2>

      {subtitle && (
        <p className={`text-cyber-gray text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}

      {align === 'center' && (
        <div className="mt-6 flex justify-center">
          <div className="w-24 h-[2px] bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-cyan rounded-full" />
        </div>
      )}
    </motion.div>
  )
}
