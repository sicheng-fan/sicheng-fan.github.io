'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  value: number
  label: string
  suffix?: string
  prefix?: string
  color?: 'green' | 'cyan' | 'orange' | 'yellow' | 'pink'
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  suffix = '',
  prefix = '',
  color = 'cyan',
}: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState(0)

  const colorMap = {
    cyan: { text: 'text-cyber-cyan', border: 'border-cyber-cyan/20 hover:border-cyber-cyan/50', glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.12)]' },
    pink: { text: 'text-cyber-pink', border: 'border-cyber-pink/20 hover:border-cyber-pink/50', glow: 'hover:shadow-[0_0_20px_rgba(255,45,117,0.12)]' },
    green: { text: 'text-cyber-green', border: 'border-cyber-green/20 hover:border-cyber-green/50', glow: 'hover:shadow-[0_0_20px_rgba(57,255,20,0.12)]' },
    orange: { text: 'text-cyber-orange', border: 'border-cyber-orange/20 hover:border-cyber-orange/50', glow: 'hover:shadow-[0_0_20px_rgba(255,140,0,0.12)]' },
    yellow: { text: 'text-cyber-yellow', border: 'border-cyber-yellow/20 hover:border-cyber-yellow/50', glow: 'hover:shadow-[0_0_20px_rgba(255,208,0,0.12)]' },
  }

  const c = colorMap[color]

  useEffect(() => {
    if (!isInView) return

    const end = value
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(Math.floor(easeOutQuart * end))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`cyber-card text-center clip-corner-sm border ${c.border} ${c.glow} transition-all`}
    >
      <Icon className={`w-7 h-7 mx-auto mb-3 ${c.text}`} />
      <div className={`font-display text-3xl font-bold mb-1 ${c.text}`}>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      <div className="text-cyber-gray font-mono text-xs uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  )
}
